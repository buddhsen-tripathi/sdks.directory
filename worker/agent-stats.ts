import { DurableObject } from "cloudflare:workers";
import type { AgentEvent, AgentEventKind } from "./analytics";
import { recordAgentEvent } from "./analytics";
import type { PublicAgentStats, WindowCounts } from "../src/types/agent-stats";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export class AgentStats extends DurableObject {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      this.migrate();
    });
  }

  private migrate() {
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS totals (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        searches INTEGER NOT NULL DEFAULT 0,
        details INTEGER NOT NULL DEFAULT 0
      )
    `);
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS hour_counts (
        hour TEXT PRIMARY KEY,
        searches INTEGER NOT NULL DEFAULT 0,
        details INTEGER NOT NULL DEFAULT 0
      )
    `);
  }

  async record(event: AgentEventKind): Promise<void> {
    const hour = utcHour(new Date());
    const isSearch = event === "search_impression";
    const searchInc = isSearch ? 1 : 0;
    const detailInc = isSearch ? 0 : 1;

    this.ctx.storage.sql.exec(
      `INSERT INTO totals (id, searches, details) VALUES (1, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         searches = searches + excluded.searches,
         details = details + excluded.details`,
      searchInc,
      detailInc,
    );
    this.ctx.storage.sql.exec(
      `INSERT INTO hour_counts (hour, searches, details) VALUES (?, ?, ?)
       ON CONFLICT(hour) DO UPDATE SET
         searches = searches + excluded.searches,
         details = details + excluded.details`,
      hour,
      searchInc,
      detailInc,
    );

    const pruneBefore = utcHour(new Date(Date.now() - 8 * DAY_MS));
    this.ctx.storage.sql.exec(
      `DELETE FROM hour_counts WHERE hour < ?`,
      pruneBefore,
    );
  }

  async snapshot(): Promise<PublicAgentStats> {
    const totals = this.ctx.storage.sql
      .exec<{ searches: number; details: number }>(
        `SELECT searches, details FROM totals WHERE id = 1`,
      )
      .toArray()[0] ?? { searches: 0, details: 0 };

    const now = Date.now();
    const last24h = this.sumSince(utcHour(new Date(now - DAY_MS)));
    const last7d = this.sumSince(utcHour(new Date(now - 7 * DAY_MS)));

    return {
      generatedAt: new Date().toISOString(),
      lookups: windows(
        last24h.searches + last24h.details,
        last7d.searches + last7d.details,
        totals.searches + totals.details,
      ),
      searches: windows(last24h.searches, last7d.searches, totals.searches),
      details: windows(last24h.details, last7d.details, totals.details),
    };
  }

  private sumSince(hour: string): { searches: number; details: number } {
    return (
      this.ctx.storage.sql
        .exec<{ searches: number; details: number }>(
          `SELECT COALESCE(SUM(searches), 0) AS searches,
                  COALESCE(SUM(details), 0) AS details
           FROM hour_counts WHERE hour >= ?`,
          hour,
        )
        .toArray()[0] ?? { searches: 0, details: 0 }
    );
  }
}

export function emptyAgentStats(): PublicAgentStats {
  const zero = windows(0, 0, 0);
  return {
    generatedAt: new Date().toISOString(),
    lookups: zero,
    searches: zero,
    details: zero,
  };
}

export function recordAgentUsage(
  env: Env,
  ctx: ExecutionContext,
  event: AgentEvent,
): void {
  recordAgentEvent(env.AGENT_ANALYTICS, event);
  ctx.waitUntil(
    env.AGENT_STATS.getByName("public")
      .record(event.event)
      .then(() => undefined)
      .catch(() => undefined),
  );
}

function windows(
  last24h: number,
  last7d: number,
  allTime: number,
): WindowCounts {
  return { last24h, last7d, allTime };
}

function utcHour(date: Date): string {
  return date.toISOString().slice(0, 13);
}

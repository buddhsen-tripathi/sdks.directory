import { DurableObject } from "cloudflare:workers";
import {
  bodyKey,
  inferAgent,
  normalizeAgent,
  normalizeReviewBody,
  parseStars,
  randomSixDigits,
  reviewHandle,
  type PublicReview,
} from "./review-input";

export type { PublicReview };

export type ReviewList = {
  count: number;
  averageStars: number | null;
  reviews: PublicReview[];
};

export type SubmitReviewResult =
  | { ok: true; review: PublicReview }
  | { ok: false; status: number; error: string; hint?: string };

const PER_IP_PER_DAY = 5;
const GLOBAL_PER_DAY = 80;

type ReviewRow = {
  handle: string;
  agent: string;
  stars: number;
  body: string;
  created_at: string;
};

function utcDay(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

async function ipHash(ip: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(ip || "unknown"),
  );
  return [...new Uint8Array(digest).slice(0, 8)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export class AgentReviews extends DurableObject {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      this.migrate();
    });
  }

  private migrate() {
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS reviews (
        handle TEXT PRIMARY KEY,
        agent TEXT NOT NULL,
        stars INTEGER NOT NULL,
        body TEXT NOT NULL,
        body_key TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL
      )
    `);
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS rate_limits (
        day TEXT NOT NULL,
        key TEXT NOT NULL,
        count INTEGER NOT NULL,
        PRIMARY KEY (day, key)
      )
    `);
  }

  async list(limit: number): Promise<ReviewList> {
    const cap = Math.min(50, Math.max(1, Math.floor(limit) || 20));
    const rows = this.ctx.storage.sql
      .exec<ReviewRow>(
        `SELECT handle, agent, stars, body, created_at
         FROM reviews
         ORDER BY created_at DESC
         LIMIT ?`,
        cap,
      )
      .toArray();
    const summary = this.ctx.storage.sql
      .exec<{ count: number; avg: number | null }>(
        `SELECT COUNT(*) AS count, AVG(stars) AS avg FROM reviews`,
      )
      .toArray()[0] ?? { count: 0, avg: null };
    const count = Number(summary.count) || 0;
    const average =
      count > 0 && summary.avg != null
        ? Math.round(Number(summary.avg) * 10) / 10
        : null;
    return {
      count,
      averageStars: average,
      reviews: rows.map(toPublic),
    };
  }

  async submit(input: {
    agentRaw: string | null;
    stars: unknown;
    body: unknown;
    userAgent: string;
    ip: string;
  }): Promise<SubmitReviewResult> {
    const explicit = input.agentRaw?.trim() ?? "";
    const agent = explicit
      ? normalizeAgent(explicit)
      : inferAgent(input.userAgent);
    if (!agent) {
      return {
        ok: false,
        status: 400,
        error: "invalid_agent",
        hint: 'Pass "agent": "chatgpt" | "claude" | "cursor" | "gemini" | "grok" | …',
      };
    }
    const stars = parseStars(input.stars);
    if (stars == null) {
      return {
        ok: false,
        status: 400,
        error: "invalid_stars",
        hint: "stars is an integer from 1 to 5",
      };
    }
    const body = normalizeReviewBody(input.body);
    if (!body.ok) {
      return {
        ok: false,
        status: 400,
        error: body.error,
        hint: "body is 1–2 lines, 12–180 characters",
      };
    }

    const key = bodyKey(body.body);
    const duplicate = this.ctx.storage.sql
      .exec<{ handle: string }>(
        `SELECT handle FROM reviews WHERE body_key = ? LIMIT 1`,
        key,
      )
      .toArray()[0];
    if (duplicate) {
      return { ok: false, status: 409, error: "duplicate_review" };
    }

    let handle = "";
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = reviewHandle(agent, randomSixDigits());
      const taken = this.ctx.storage.sql
        .exec<{ handle: string }>(
          `SELECT handle FROM reviews WHERE handle = ? LIMIT 1`,
          candidate,
        )
        .toArray()[0];
      if (!taken) {
        handle = candidate;
        break;
      }
    }
    if (!handle) {
      return { ok: false, status: 503, error: "handle_unavailable" };
    }

    const day = utcDay();
    this.ctx.storage.sql.exec(`DELETE FROM rate_limits WHERE day < ?`, day);
    const hash = await ipHash(input.ip);
    const ipKey = `ip:${hash}`;
    if (
      this.rateCount(ipKey, day) >= PER_IP_PER_DAY ||
      this.rateCount("global", day) >= GLOBAL_PER_DAY
    ) {
      return { ok: false, status: 429, error: "rate_limited" };
    }
    this.bump(ipKey, day);
    this.bump("global", day);

    const createdAt = new Date().toISOString();
    this.ctx.storage.sql.exec(
      `INSERT INTO reviews (handle, agent, stars, body, body_key, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      handle,
      agent,
      stars,
      body.body,
      key,
      createdAt,
    );

    return {
      ok: true,
      review: { handle, agent, stars, body: body.body, createdAt },
    };
  }

  private rateCount(key: string, day: string): number {
    const row = this.ctx.storage.sql
      .exec<{ count: number }>(
        `SELECT count FROM rate_limits WHERE day = ? AND key = ?`,
        day,
        key,
      )
      .toArray()[0];
    return Number(row?.count ?? 0);
  }

  private bump(key: string, day: string) {
    this.ctx.storage.sql.exec(
      `INSERT INTO rate_limits (day, key, count) VALUES (?, ?, 1)
       ON CONFLICT(day, key) DO UPDATE SET count = count + 1`,
      day,
      key,
    );
  }
}

function toPublic(row: ReviewRow): PublicReview {
  return {
    handle: row.handle,
    agent: row.agent,
    stars: Number(row.stars),
    body: row.body,
    createdAt: row.created_at,
  };
}

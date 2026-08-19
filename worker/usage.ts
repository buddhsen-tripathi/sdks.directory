import type { AgentEvent } from "./analytics";
import { recordAgentEvent } from "./analytics";
import type { PublicAgentStats } from "../src/types/agent-stats";

const emptyWindow = { last24h: 0, last7d: 0, allTime: 0 };

export function emptyAgentStats(): PublicAgentStats {
  return {
    generatedAt: new Date().toISOString(),
    totalLookups: 0,
    lookups: emptyWindow,
    searches: emptyWindow,
    details: emptyWindow,
  };
}

export async function readPublicStats(env: Env): Promise<PublicAgentStats> {
  try {
    return await env.AGENT_STATS.getByName("public").snapshot();
  } catch {
    return emptyAgentStats();
  }
}

/** One-line proof for agent-facing markdown. */
export function formatLookupProof(
  stats: PublicAgentStats,
  origin: string,
): string {
  const total = stats.totalLookups;
  const noun = total === 1 ? "lookup" : "lookups";
  return `${total.toLocaleString("en-US")} catalog ${noun} all time (API + MCP, not human page views). Last 7 days: ${stats.lookups.last7d.toLocaleString("en-US")}. Last 24 hours: ${stats.lookups.last24h.toLocaleString("en-US")}. Live JSON: ${origin}/api/stats`;
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

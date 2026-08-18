import type { AgentEvent } from "./analytics";
import { recordAgentEvent } from "./analytics";
import type { PublicAgentStats } from "../src/types/agent-stats";

const emptyWindow = { last24h: 0, last7d: 0, allTime: 0 };

export function emptyAgentStats(): PublicAgentStats {
  return {
    generatedAt: new Date().toISOString(),
    lookups: emptyWindow,
    searches: emptyWindow,
    details: emptyWindow,
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

/** Public agent-lookup aggregates. Counts only — no queries, slugs, or clients. */
export type WindowCounts = {
  last24h: number;
  last7d: number;
  allTime: number;
};

export type PublicAgentStats = {
  generatedAt: string;
  lookups: WindowCounts;
  searches: WindowCounts;
  details: WindowCounts;
};

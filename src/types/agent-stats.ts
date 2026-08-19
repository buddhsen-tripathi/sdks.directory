/** Public agent-lookup aggregates. Counts only — no queries, slugs, or clients. */
export type WindowCounts = {
  last24h: number;
  last7d: number;
  allTime: number;
};

export type PublicAgentStats = {
  generatedAt: string;
  /** All-time catalog lookups (searches + details). Same as `lookups.allTime`. */
  totalLookups: number;
  lookups: WindowCounts;
  searches: WindowCounts;
  details: WindowCounts;
};

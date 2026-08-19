/** Homepage proof stays hidden until all-time lookups reach this floor. */
export const MIN_PUBLIC_LOOKUP_PROOF = 100;

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

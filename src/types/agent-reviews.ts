export type AgentReview = {
  handle: string;
  agent: string;
  stars: number;
  body: string;
  createdAt: string;
};

export type AgentReviewList = {
  count: number;
  averageStars: number | null;
  reviews: AgentReview[];
};

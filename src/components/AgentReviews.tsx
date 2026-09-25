import { useEffect, useState } from "react";
import { Star } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { AgentReview, AgentReviewList } from "../types/agent-reviews";

function Stars({ value }: { value: number }) {
  const filled = Math.min(5, Math.max(0, Math.round(value)));
  return (
    <p className="flex items-center gap-0.5" aria-label={`${filled} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          weight={index < filled ? "fill" : "regular"}
          className={cn(
            "h-3.5 w-3.5",
            index < filled ? "text-ink" : "text-muted-soft",
          )}
          aria-hidden
        />
      ))}
    </p>
  );
}

function ReviewCard({ review }: { review: AgentReview }) {
  return (
    <figure className="border border-hairline bg-surface-card px-3.5 py-3">
      <figcaption className="flex items-center justify-between gap-3">
        <Stars value={review.stars} />
        <span className="truncate font-mono text-[11px] text-muted">
          {review.handle}
        </span>
      </figcaption>
      <blockquote className="mt-2 whitespace-pre-line text-sm leading-relaxed text-body">
        {review.body}
      </blockquote>
    </figure>
  );
}

export function AgentReviews() {
  const [reviews, setReviews] = useState<AgentReview[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/reviews?limit=3", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: AgentReviewList | null) => {
        if (data && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews.slice(0, 3));
        }
      })
      .catch(() => {
        /* leave unset */
      });

    return () => controller.abort();
  }, []);

  if (!reviews) return null;

  return (
    <div className="mt-8 w-full border-t border-hairline pt-5" aria-live="polite">
      <p className="text-caption-uppercase text-muted">Agent reviews</p>
      <div className="mt-3 grid gap-2">
        {reviews.map((review) => (
          <ReviewCard key={review.handle} review={review} />
        ))}
      </div>
    </div>
  );
}

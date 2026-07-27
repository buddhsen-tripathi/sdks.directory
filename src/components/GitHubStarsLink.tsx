import { useEffect, useState } from "react";
import { GithubLogo, Star } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { githubApiRepoUrl, githubRepoUrl } from "@/config/site";

function formatStars(count: number) {
  if (count >= 1000) {
    const value = count / 1000;
    return `${value >= 10 ? Math.round(value) : value.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(count);
}

export function GitHubStarsLink({
  className,
  size = "sm",
}: {
  className?: string;
  size?: "sm" | "default";
}) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(githubApiRepoUrl(), {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { stargazers_count?: number } | null) => {
        if (!cancelled && typeof data?.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {
        /* leave stars unset */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Button asChild variant="secondary" size={size} className={className}>
      <a href={githubRepoUrl()} target="_blank" rel="noreferrer">
        <GithubLogo weight="fill" className="h-4 w-4" />
        <span className="hidden sm:inline">GitHub</span>
        {stars !== null ? (
          <span className="inline-flex items-center gap-1 border-l border-hairline-strong pl-2 font-mono text-xs tabular-nums text-body">
            <Star weight="fill" className="h-3 w-3 text-ink" />
            {formatStars(stars)}
          </span>
        ) : null}
      </a>
    </Button>
  );
}

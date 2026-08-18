import { useEffect, useState } from "react";
import type { PublicAgentStats } from "../types/agent-stats";

function formatCount(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${millions >= 10 ? Math.round(millions) : millions.toFixed(1).replace(/\.0$/, "")}m`;
  }
  if (value >= 1_000) {
    const thousands = value / 1_000;
    return `${thousands >= 10 ? Math.round(thousands) : thousands.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return new Intl.NumberFormat("en-US").format(value);
}

function StatCell({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="font-mono text-xl tabular-nums tracking-tight text-ink md:text-2xl">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted-soft">{label}</p>
    </div>
  );
}

export function AgentUsageStats() {
  const [stats, setStats] = useState<PublicAgentStats | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/stats", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PublicAgentStats | null) => {
        if (
          data &&
          typeof data.lookups?.last7d === "number" &&
          typeof data.lookups?.allTime === "number"
        ) {
          setStats(data);
        }
      })
      .catch(() => {
        /* leave unset */
      });

    return () => controller.abort();
  }, []);

  const week = stats?.lookups.last7d;
  const label =
    week === 1 ? "catalog lookup this week" : "catalog lookups this week";

  return (
    <div
      className="mt-8 w-full border-t border-hairline pt-5"
      aria-live="polite"
    >
      <p className="text-caption-uppercase text-muted">Used by agents</p>
      <p className="mt-2 text-sm leading-snug text-body md:text-[15px]">
        <span className="font-mono text-lg tabular-nums text-ink md:text-xl">
          {week === undefined ? "—" : formatCount(week)}
        </span>{" "}
        {label}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <StatCell
          label="Last 24 hours"
          value={
            stats ? formatCount(stats.lookups.last24h) : "—"
          }
        />
        <StatCell
          label="Searches (7d)"
          value={stats ? formatCount(stats.searches.last7d) : "—"}
        />
        <StatCell
          label="Detail pulls (7d)"
          value={stats ? formatCount(stats.details.last7d) : "—"}
        />
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-muted-soft">
        Counted from the catalog API and MCP — not human page views.
        {stats && stats.lookups.allTime > 0
          ? ` ${formatCount(stats.lookups.allTime)} all time.`
          : stats
            ? " Counter starts from this deploy."
            : null}
      </p>
    </div>
  );
}

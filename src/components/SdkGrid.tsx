import type { SdkEntry } from "../types/catalog";
import { SdkCard } from "./SdkCard";

interface SdkGridProps {
  sdks: SdkEntry[];
  emptyMessage?: string;
}

export function SdkGrid({
  sdks,
  emptyMessage = "No SDKs match these filters.",
}: SdkGridProps) {
  if (sdks.length === 0) {
    return (
      <p className="rounded-sm bg-surface-card px-6 py-12 text-center text-body ring-1 ring-hairline">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sdks.map((sdk, index) => (
        <SdkCard
          key={sdk.id}
          sdk={sdk}
          className="animate-rise"
          style={{ animationDelay: `${Math.min(index, 9) * 35}ms` }}
        />
      ))}
    </div>
  );
}

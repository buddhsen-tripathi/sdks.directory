import { SealCheck } from "@phosphor-icons/react";
import { resolveSdkBrandIcon } from "@/lib/brand-icons";
import type { SdkEntry } from "@/types/catalog";
import { cn } from "@/lib/utils";

export function SdkBrandIcon({
  sdk,
  size = 20,
  className,
}: {
  sdk: SdkEntry;
  size?: number;
  className?: string;
}) {
  const resolved = resolveSdkBrandIcon(sdk);

  if (resolved.kind === "lobe") {
    const Icon = resolved.Lobe.Color ?? resolved.Lobe;
    return (
      <Icon
        size={size}
        className={cn("shrink-0 text-ink", className)}
        aria-hidden
      />
    );
  }

  if (resolved.kind === "simple") {
    const Icon = resolved.Simple;
    return (
      <Icon
        size={size}
        className={cn("shrink-0 text-ink", className)}
        aria-hidden
      />
    );
  }

  const CategoryIcon = resolved.Category ?? SealCheck;
  return (
    <CategoryIcon
      weight="regular"
      className={cn("shrink-0 text-ink", className)}
      style={{ width: size, height: size }}
      aria-hidden
    />
  );
}

import type { CSSProperties } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import type { SdkEntry } from "../types/catalog";
import { getLanguage } from "../data";
import { catalogDetailPath, catalogKindMeta } from "../lib/catalog";
import { cn } from "../lib/utils";
import { CardFrame } from "./CardFrame";
import { SdkBrandIcon } from "./SdkBrandIcon";
import { TechIcon } from "./TechIcon";

interface SdkCardProps {
  sdk: SdkEntry;
  style?: CSSProperties;
  className?: string;
}

export function SdkCard({ sdk, style, className }: SdkCardProps) {
  const langs = sdk.languages.slice(0, 4);
  const platforms = sdk.platforms?.slice(0, 3) ?? [];
  const showLanguages = langs.length > 0;
  const showPlatforms = !showLanguages && platforms.length > 0;

  return (
    <CardFrame
      to={catalogDetailPath(sdk)}
      style={style}
      className={cn("flex h-full flex-col p-4 text-ink", className)}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-sm border border-hairline bg-surface-card-elevated text-ink">
          <SdkBrandIcon sdk={sdk} size={18} />
        </span>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {sdk.kind !== "sdk" ? (
            <span className="rounded-sm border border-hairline bg-surface-card-elevated px-2 py-0.5 text-caption-uppercase text-muted">
              {catalogKindMeta(sdk.kind).label}
            </span>
          ) : null}
          {sdk.official ? (
            <span className="inline-flex items-center gap-1.5 rounded-sm border border-hairline bg-surface-card-elevated px-2 py-0.5 text-caption-uppercase text-body-strong">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
              Official
            </span>
          ) : null}
        </div>
      </div>

      <h3 className="mt-3 text-base font-semibold leading-snug tracking-tight text-ink">
        {sdk.name}
      </h3>
      <p className="mt-0.5 text-sm text-body">{sdk.vendor}</p>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-body">
        {sdk.description}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-hairline pt-3">
        <div className="flex min-w-0 items-center gap-1.5">
          {showLanguages
            ? langs.map((id) => {
                const lang = getLanguage(id);
                return (
                  <span
                    key={id}
                    title={lang?.name}
                    className="grid h-7 w-7 place-items-center rounded-sm border border-hairline bg-surface-card-elevated"
                  >
                    <TechIcon languageId={id} size={14} color={lang?.color} />
                  </span>
                );
              })
            : null}
          {showLanguages && sdk.languages.length > 4 ? (
            <span className="text-xs text-muted">
              +{sdk.languages.length - 4}
            </span>
          ) : null}
          {showPlatforms
            ? platforms.map((platform) => (
                <span
                  key={platform}
                  className="rounded-sm border border-hairline bg-surface-card-elevated px-2 py-0.5 text-[11px] uppercase tracking-wide text-body"
                >
                  {platform}
                </span>
              ))
            : null}
          {!showLanguages && !showPlatforms && sdk.categories[0] ? (
            <span className="truncate text-xs text-muted">
              {sdk.categories[0]}
            </span>
          ) : null}
        </div>
        <ArrowRight
          weight="bold"
          className="h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>
    </CardFrame>
  );
}

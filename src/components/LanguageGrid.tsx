import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { languages, getLanguageCounts } from "../data";
import type { LanguageId } from "../types/catalog";
import { CardFrame } from "./CardFrame";
import { TechIcon } from "./TechIcon";
import { cn } from "../lib/utils";

interface LanguageGridProps {
  limit?: number;
  showAllLink?: boolean;
}

export function LanguageGrid({ limit, showAllLink = false }: LanguageGridProps) {
  const counts = getLanguageCounts();
  const list = (limit ? languages.slice(0, limit) : languages).filter(
    (lang) => (counts[lang.id] ?? 0) > 0,
  );

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {list.map((lang, index) => (
          <CardFrame
            key={lang.id}
            to={`/languages/${lang.id}`}
            className={cn("animate-rise p-4")}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <span className="mb-3 grid h-9 w-9 place-items-center rounded-sm border border-hairline bg-surface-card-elevated">
              <TechIcon
                languageId={lang.id as LanguageId}
                size={22}
                color={lang.color}
              />
            </span>
            <span className="block text-sm font-semibold text-ink">
              {lang.name}
            </span>
            <span className="mt-1 flex items-center justify-between text-sm text-body">
              {counts[lang.id] ?? 0} SDKs
              <ArrowRight
                weight="bold"
                className="h-3.5 w-3.5 text-primary opacity-0 transition-opacity group-hover:opacity-100"
              />
            </span>
          </CardFrame>
        ))}
      </div>
      {showAllLink ? (
        <div className="mt-4">
          <Link
            to="/languages"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink no-underline hover:text-primary"
          >
            View all languages
            <ArrowRight weight="bold" className="h-4 w-4" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

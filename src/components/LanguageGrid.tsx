import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { languages, getLanguageCounts } from "../data";
import type { LanguageId } from "../types/catalog";
import { CardFrame } from "./CardFrame";
import { TechIcon } from "./TechIcon";

interface LanguageGridProps {
  limit?: number;
  showAllLink?: boolean;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function LanguageGrid({ limit, showAllLink = false }: LanguageGridProps) {
  const counts = getLanguageCounts();
  const reduce = useReducedMotion();
  const list = (limit ? languages.slice(0, limit) : languages).filter(
    (lang) => (counts[lang.id] ?? 0) > 0,
  );

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {list.map((lang, index) => {
          const card = (
            <CardFrame to={`/languages/${lang.id}`} className="p-4">
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
          );

          if (reduce) {
            return <div key={lang.id}>{card}</div>;
          }

          return (
            <motion.div
              key={lang.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.4,
                ease,
                delay: Math.min(index, 11) * 0.035,
              }}
            >
              {card}
            </motion.div>
          );
        })}
      </div>
      {showAllLink ? (
        <div className="mt-4">
          <Link
            to="/languages"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink no-underline hover:text-primary"
          >
            All language filters
            <ArrowRight weight="bold" className="h-4 w-4" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

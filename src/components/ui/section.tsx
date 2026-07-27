import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative z-10 mx-auto w-full max-w-[1200px] px-5 py-12 md:px-6 md:py-16",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  description,
  className,
  as = "h1",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  const TitleTag = as;
  return (
    <div className={cn("mb-5 max-w-2xl", className)}>
      {eyebrow ? (
        <p className="text-caption-uppercase mb-2 text-muted">{eyebrow}</p>
      ) : null}
      <TitleTag
        className={cn(
          "text-ink",
          as === "h1" ? "text-display-xl" : "text-display-lg",
        )}
      >
        {title}
      </TitleTag>
      {description ? (
        <div className="mt-2 text-base leading-relaxed text-body md:text-[16px]">
          {description}
        </div>
      ) : null}
    </div>
  );
}

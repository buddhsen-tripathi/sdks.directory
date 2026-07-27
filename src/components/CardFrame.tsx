import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

const corners = [
  { position: "-top-[3px] -left-[3px]", border: "border-t border-l" },
  { position: "-top-[3px] -right-[3px]", border: "border-t border-r" },
  { position: "-bottom-[3px] -left-[3px]", border: "border-b border-l" },
  { position: "-bottom-[3px] -right-[3px]", border: "border-b border-r" },
] as const;

/** Sharp panel — closer to in-app menus than soft marketing cards. */
const frameClass = [
  "group relative block min-w-0 rounded-sm border border-hairline bg-surface-card",
  "transition-[background-color,border-color] duration-150",
  "hover:border-hairline-strong hover:bg-surface-card-elevated",
].join(" ");

function FrameDecor() {
  return (
    <>
      <span
        className="pointer-events-none absolute -inset-[3px] rounded-[3px] border border-dashed border-ink/0 transition-colors duration-200 group-hover:border-ink/35"
        aria-hidden
      />
      {corners.map(({ position, border }) => (
        <span
          key={position}
          className={cn(
            "pointer-events-none absolute h-[5px] w-[5px] border-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100",
            position,
            border,
          )}
          aria-hidden
        />
      ))}
    </>
  );
}

export function CardFrame({
  children,
  className,
  to,
  style,
}: {
  children: ReactNode;
  className?: string;
  to?: string;
  style?: CSSProperties;
}) {
  if (to) {
    return (
      <Link
        to={to}
        style={style}
        className={cn(frameClass, "no-underline", className)}
      >
        <FrameDecor />
        {children}
      </Link>
    );
  }

  return (
    <div style={style} className={cn(frameClass, className)}>
      <FrameDecor />
      {children}
    </div>
  );
}

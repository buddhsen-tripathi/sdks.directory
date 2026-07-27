import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function SiteLogo({
  className,
  showWordmark = true,
  size = 28,
}: {
  className?: string;
  showWordmark?: boolean;
  size?: number;
}) {
  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-center gap-2.5 text-ink no-underline",
        className,
      )}
      aria-label="sdks.directory home"
    >
      <img
        src="/favicon.svg"
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-[6px]"
        decoding="async"
      />
      {showWordmark ? (
        <span className="text-[15px] font-medium tracking-tight">
          sdks<span className="text-primary">.</span>directory
        </span>
      ) : null}
    </Link>
  );
}

import type { LanguageId } from "../types/catalog";
import { languageIcons } from "../lib/icons";
import { cn } from "../lib/utils";

export function TechIcon({
  languageId,
  className,
  color,
  size = 20,
}: {
  languageId: LanguageId;
  className?: string;
  color?: string;
  size?: number;
}) {
  const Icon = languageIcons[languageId];
  if (!Icon) return null;
  return (
    <Icon
      size={size}
      color={color}
      className={cn("shrink-0", className)}
      aria-hidden
    />
  );
}

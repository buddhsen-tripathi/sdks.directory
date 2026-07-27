import { Link } from "react-router-dom";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react";
import { SiteLogo } from "./SiteLogo";
import { Button } from "@/components/ui/button";
import { getLanguageCounts, languages, sdks } from "@/data";

const nav = [
  { to: "/browse", label: "Browse" },
  { to: "/languages", label: "Languages" },
  { to: "/search", label: "Search" },
] as const;

export function SiteFooter() {
  const counts = getLanguageCounts();
  const langCount = languages.filter((l) => (counts[l.id] ?? 0) > 0).length;
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 overflow-hidden border-t border-hairline bg-canvas">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-0 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-5 py-14 md:px-6 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <SiteLogo size={32} />
            <p className="mt-4 text-lg font-medium leading-snug tracking-tight text-ink md:text-xl">
              Every official client, indexed by the language you ship in.
            </p>
            <p className="mt-3 font-mono text-xs text-muted">
              {sdks.length} SDKs · {langCount} runtimes · curated seed
            </p>
          </div>

          <Button asChild variant="secondary" className="w-fit">
            <a
              href="https://github.com/buddhsen-tripathi/sdks.directory"
              target="_blank"
              rel="noreferrer"
            >
              <GithubLogo weight="duotone" className="h-4 w-4" />
              Star on GitHub
              <ArrowUpRight weight="bold" className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-1 gap-y-2">
            {nav.map((item, index) => (
              <span key={item.to} className="inline-flex items-center">
                {index > 0 ? (
                  <span className="mx-2 text-muted-soft" aria-hidden>
                    /
                  </span>
                ) : null}
                <Link
                  to={item.to}
                  className="text-sm font-medium text-body no-underline transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </span>
            ))}
            <span className="mx-2 text-muted-soft" aria-hidden>
              /
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-muted-soft">
              Plugins
              <span className="rounded-sm border border-hairline px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">
                soon
              </span>
            </span>
            <span className="mx-2 text-muted-soft" aria-hidden>
              /
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-muted-soft">
              MCPs
              <span className="rounded-sm border border-hairline px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">
                soon
              </span>
            </span>
          </nav>

          <p className="font-mono text-xs text-muted-soft">
            © {year} sdks.directory
          </p>
        </div>

        <p
          className="pointer-events-none mt-10 select-none text-[clamp(2.5rem,10vw,6.5rem)] font-medium leading-none tracking-[-0.06em] text-ink/[0.06] dark:text-ink/[0.04]"
          aria-hidden
        >
          sdks.directory
        </p>
      </div>
    </footer>
  );
}

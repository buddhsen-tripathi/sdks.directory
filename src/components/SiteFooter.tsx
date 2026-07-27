import { Link } from "react-router-dom";
import { SiteLogo } from "./SiteLogo";
import { GitHubStarsLink } from "@/components/GitHubStarsLink";

const nav = [
  { to: "/browse", label: "SDKs" },
  { to: "/plugins", label: "Plugins" },
  { to: "/mcps", label: "MCPs" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 overflow-x-hidden bg-canvas">
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 top-1/3 h-56 w-56 rounded-full bg-accent-cyan/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-5 pb-12 pt-14 md:px-6 md:pb-16 md:pt-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <SiteLogo size={32} />
            <p className="mt-4 text-lg font-medium leading-snug tracking-tight text-ink md:text-xl">
              Official SDKs, plugins, and MCP servers.
            </p>
          </div>

          <GitHubStarsLink className="w-fit" size="default" />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-1 gap-y-2"
          >
            {nav.map((item, index) => (
              <span key={item.to} className="inline-flex items-center">
                {index > 0 ? (
                  <span className="mx-2.5 text-muted-soft/70" aria-hidden>
                    /
                  </span>
                ) : null}
                <Link
                  to={item.to}
                  className="text-sm font-medium text-body no-underline transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>

          <p className="font-mono text-xs text-muted-soft sm:text-right">
            © {year} sdks.directory
          </p>
        </div>

        <p
          className="footer-wordmark-liquid pointer-events-none mt-12 select-none pb-2 text-center text-[clamp(2.75rem,11vw,7rem)] font-medium leading-none tracking-[-0.06em]"
          aria-hidden
        >
          sdks.directory
        </p>
      </div>
    </footer>
  );
}

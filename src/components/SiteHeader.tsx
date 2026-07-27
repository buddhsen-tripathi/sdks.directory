import { useId, useState, type FormEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SiteLogo } from "@/components/SiteLogo";
import { GitHubStarsLink } from "@/components/GitHubStarsLink";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  const navigate = useNavigate();
  const inputId = useId();
  const [query, setQuery] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/browse");
  }

  return (
    <header className="sticky top-0 z-50 h-16 bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-full w-full max-w-[1200px] items-center gap-6 px-5 md:px-6">
        <SiteLogo showWordmark={false} size={32} />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {siteConfig.nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-sm px-3 py-1.5 text-sm font-medium no-underline transition-colors",
                  isActive
                    ? "bg-surface-card-elevated text-ink"
                    : "text-body hover:text-ink",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <form
            className="hidden min-w-0 sm:block sm:w-48 md:w-56"
            onSubmit={onSubmit}
            role="search"
          >
            <label htmlFor={inputId} className="sr-only">
              Search SDKs
            </label>
            <div className="relative">
              <MagnifyingGlass
                weight="bold"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              />
              <input
                id={inputId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                autoComplete="off"
                className="h-10 w-full rounded-sm border border-hairline-strong bg-surface-card py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </form>
          <ThemeToggle />
          <GitHubStarsLink />
        </div>
      </div>
    </header>
  );
}

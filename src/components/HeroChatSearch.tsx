import { useId, useState, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp, MagnifyingGlass, Sparkle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const suggestions = [
  "Stripe SDK for Python",
  "Auth0 in TypeScript",
  "AWS S3 client for Go",
  "Anthropic Messages API",
  "Supabase JS client",
];

export function HeroChatSearch({
  sdkCount,
  langCount,
}: {
  sdkCount: number;
  langCount: number;
}) {
  const navigate = useNavigate();
  const inputId = useId();
  const [query, setQuery] = useState("");

  function submit(value = query) {
    const q = value.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/browse");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    submit();
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <section className="relative overflow-hidden border-b border-hairline">
      <div className="spotlight-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex w-full max-w-[720px] flex-col items-center px-5 pb-14 pt-16 md:px-6 md:pb-20 md:pt-24">
        <img
          src="/favicon.svg"
          alt=""
          width={48}
          height={48}
          className="animate-rise mb-6 rounded-[10px] shadow-[0_0_0_1px_rgb(255_255_255/0.08)]"
          decoding="async"
        />

        <h1 className="animate-rise text-center text-display-lg text-ink [animation-delay:40ms]">
          Find the SDK for your stack
        </h1>
        <p className="animate-rise mt-3 max-w-lg text-center text-base leading-relaxed text-body md:text-lg [animation-delay:80ms]">
          Ask in plain language or search by package. {sdkCount} SDKs across{" "}
          {langCount} runtimes.
        </p>

        <form
          onSubmit={onSubmit}
          className={cn(
            "animate-rise mt-8 w-full [animation-delay:120ms]",
            "rounded-sm border border-hairline-strong bg-surface-card p-3",
            "shadow-[0_12px_40px_-24px_rgb(15_15_15/0.18)] dark:shadow-[0_20px_50px_-28px_rgb(0_7_205/0.45)]",
            "focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/25",
          )}
          role="search"
        >
          <label htmlFor={inputId} className="sr-only">
            Ask or search the SDK directory
          </label>

          <div className="flex items-start gap-3 px-2 pt-1">
            <Sparkle
              weight="duotone"
              className="mt-2.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden
            />
            <textarea
              id={inputId}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              rows={2}
              autoFocus
              placeholder="What SDK do you need? e.g. payments in Go, Claude for Python…"
              className="min-h-[64px] w-full resize-none bg-transparent py-2 text-[15px] leading-relaxed text-ink placeholder:text-muted-soft focus-visible:outline-none"
            />
          </div>

          <div className="mt-2 flex items-center justify-between gap-3 border-t border-hairline px-1 pt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-soft">
              <MagnifyingGlass weight="bold" className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Enter to search</span>
              <span className="sm:hidden">Search catalog</span>
            </div>
            <Button
              type="submit"
              size="sm"
              className="gap-1.5"
              aria-label="Search"
            >
              Search
              <ArrowUp weight="bold" className="h-3.5 w-3.5" />
            </Button>
          </div>
        </form>

        <div className="animate-rise mt-5 flex w-full flex-wrap justify-center gap-2 [animation-delay:160ms]">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setQuery(suggestion);
                submit(suggestion);
              }}
              className="rounded-sm border border-hairline bg-surface-card px-3 py-1.5 text-xs font-medium text-body transition-colors hover:border-hairline-strong hover:bg-surface-card-elevated hover:text-ink"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

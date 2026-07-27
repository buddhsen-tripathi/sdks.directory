import { useId, useState, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUp, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const suggestions = [
  "stripe",
  "anthropic python",
  "auth0 typescript",
  "aws s3 go",
  "supabase js",
];

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroChatSearch() {
  const navigate = useNavigate();
  const inputId = useId();
  const [query, setQuery] = useState("");
  const reduce = useReducedMotion();

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

  const enter = reduce
    ? undefined
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section className="relative overflow-hidden">
      <div className="spotlight-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex w-full max-w-[720px] flex-col items-center px-5 pb-10 pt-16 md:px-6 md:pb-12 md:pt-20">
        <motion.img
          src="/favicon.svg"
          alt=""
          width={44}
          height={44}
          className="mb-5 rounded-[8px]"
          decoding="async"
          {...enter}
          transition={{ duration: 0.5, ease }}
        />

        <motion.h1
          className="text-center text-display-lg text-ink"
          {...enter}
          transition={{ duration: 0.55, ease, delay: 0.05 }}
        >
          sdks.directory
        </motion.h1>
        <motion.p
          className="mt-3 max-w-md text-center text-base leading-relaxed text-body md:text-lg"
          {...enter}
          transition={{ duration: 0.55, ease, delay: 0.1 }}
        >
          Official clients by name, package, or vendor.
        </motion.p>

        <motion.form
          onSubmit={onSubmit}
          className={cn(
            "mt-8 w-full rounded-sm border border-hairline-strong bg-surface-card p-3",
            "shadow-[0_12px_40px_-24px_rgb(15_15_15/0.18)] dark:shadow-[0_20px_50px_-28px_rgb(0_7_205/0.45)]",
            "focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/25",
          )}
          role="search"
          {...enter}
          transition={{ duration: 0.55, ease, delay: 0.16 }}
        >
          <label htmlFor={inputId} className="sr-only">
            Search SDKs
          </label>

          <div className="flex items-start gap-3 px-2 pt-1">
            <MagnifyingGlass
              weight="bold"
              className="mt-2.5 h-5 w-5 shrink-0 text-muted"
              aria-hidden
            />
            <textarea
              id={inputId}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              rows={2}
              autoFocus
              placeholder="stripe · anthropic · auth0 typescript…"
              className="min-h-[64px] w-full resize-none bg-transparent py-2 text-[15px] leading-relaxed text-ink placeholder:text-muted-soft focus-visible:outline-none"
            />
          </div>

          <div className="mt-2 flex items-center justify-between gap-3 border-t border-hairline px-1 pt-3">
            <p className="text-xs text-muted-soft">Enter to search</p>
            <Button type="submit" size="sm" className="gap-1.5" aria-label="Search">
              Search
              <ArrowUp weight="bold" className="h-3.5 w-3.5" />
            </Button>
          </div>
        </motion.form>

        <motion.div
          className="mt-5 flex w-full flex-wrap justify-center gap-2"
          {...enter}
          transition={{ duration: 0.55, ease, delay: 0.22 }}
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setQuery(suggestion);
                submit(suggestion);
              }}
              className="rounded-sm border border-hairline bg-surface-card px-3 py-1.5 font-mono text-xs text-body transition-colors hover:border-hairline-strong hover:bg-surface-card-elevated hover:text-ink"
            >
              {suggestion}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

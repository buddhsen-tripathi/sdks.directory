import { useId, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUp, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
            "mt-8 w-full rounded-sm border border-hairline-strong bg-surface-card p-2.5 pl-3",
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

          <div className="flex items-center gap-2">
            <MagnifyingGlass
              weight="bold"
              className="h-5 w-5 shrink-0 text-muted"
              aria-hidden
            />
            <input
              id={inputId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              autoComplete="off"
              placeholder="Search SDKs…"
              className="h-11 min-w-0 flex-1 bg-transparent text-[15px] leading-normal text-ink placeholder:text-muted-soft focus-visible:outline-none"
            />
            <Button type="submit" size="sm" className="shrink-0 gap-1.5" aria-label="Search">
              Search
              <ArrowUp weight="bold" className="h-3.5 w-3.5" />
            </Button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

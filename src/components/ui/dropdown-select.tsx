import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { CaretDown, Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type DropdownOption<T extends string = string> = {
  value: T;
  label: string;
  icon?: ReactNode;
};

type DropdownSelectProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: DropdownOption<T>[];
  placeholder: string;
  "aria-label": string;
  className?: string;
};

export function DropdownSelect<T extends string>({
  value,
  onChange,
  options,
  placeholder,
  "aria-label": ariaLabel,
  className,
}: DropdownSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value);
  const label = selected?.label ?? placeholder;

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const selectedIndex = Math.max(
      0,
      options.findIndex((option) => option.value === value),
    );
    const item = listRef.current?.querySelectorAll<HTMLElement>("[role='option']")[
      selectedIndex
    ];
    item?.focus();
  }, [open, options, value]);

  function choose(next: T) {
    onChange(next);
    setOpen(false);
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function onOptionKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next =
        listRef.current?.querySelectorAll<HTMLElement>("[role='option']")[
          Math.min(index + 1, options.length - 1)
        ];
      next?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prev =
        listRef.current?.querySelectorAll<HTMLElement>("[role='option']")[
          Math.max(index - 1, 0)
        ];
      prev?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      listRef.current
        ?.querySelectorAll<HTMLElement>("[role='option']")[0]
        ?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      const items =
        listRef.current?.querySelectorAll<HTMLElement>("[role='option']");
      items?.[items.length - 1]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className={cn("relative min-w-0", className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "flex h-11 w-full items-center gap-2 rounded-sm border border-hairline-strong bg-surface-card px-3 text-left text-sm text-ink",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          open && "ring-2 ring-primary",
        )}
      >
        {selected?.icon ? (
          <span className="grid h-5 w-5 shrink-0 place-items-center">
            {selected.icon}
          </span>
        ) : null}
        <span
          className={cn(
            "min-w-0 flex-1 truncate",
            !selected && "text-muted",
          )}
        >
          {label}
        </span>
        <CaretDown
          weight="bold"
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute z-40 mt-1 max-h-72 w-full overflow-auto rounded-sm border border-hairline-strong bg-surface-card py-1 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.35)]"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                  onClick={() => choose(option.value)}
                  onKeyDown={(event) => onOptionKeyDown(event, index)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink",
                    "hover:bg-surface-card-elevated focus-visible:bg-surface-card-elevated focus-visible:outline-none",
                    isSelected && "bg-surface-card-elevated",
                  )}
                >
                  {option.icon ? (
                    <span className="grid h-5 w-5 shrink-0 place-items-center">
                      {option.icon}
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {isSelected ? (
                    <Check
                      weight="bold"
                      className="h-3.5 w-3.5 shrink-0 text-primary"
                    />
                  ) : (
                    <span className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

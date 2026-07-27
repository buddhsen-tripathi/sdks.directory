import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-medium tracking-[-0.01em] select-none no-underline",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
    "disabled:pointer-events-none disabled:opacity-45",
    "active:translate-y-px",
  ].join(" "),
  {
    variants: {
      variant: {
        // Solid ink fill — quiet, suits the catalog cards
        primary:
          "border border-transparent bg-ink text-canvas hover:bg-ink/90",
        secondary:
          "border border-hairline-strong bg-surface-card text-ink hover:bg-surface-card-elevated",
        outline:
          "border border-hairline-strong bg-transparent text-ink hover:bg-surface-card",
        ghost: "border border-transparent bg-transparent text-body hover:bg-surface-card hover:text-ink",
        icon: "border border-hairline-strong bg-surface-card text-ink hover:bg-surface-card-elevated",
      },
      size: {
        sm: "h-9 rounded-sm px-3.5 text-sm",
        default: "h-10 rounded-sm px-4 text-sm",
        lg: "h-11 rounded-sm px-5 text-[15px]",
        icon: "h-10 w-10 rounded-sm p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

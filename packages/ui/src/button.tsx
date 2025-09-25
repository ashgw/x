import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@ashgw/ui";
import { LoadingPoints } from "./loading";

const buttonVariants = cva(
  "py-2 px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap " +
    "transition-colors focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-[hsl(var(--ds-ring))] focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-[hsl(var(--ds-background))] " +
    "disabled:pointer-events-none disabled:opacity-[var(--ds-opacity-medium)]",
  {
    variants: {
      variant: {
        default:
          "rounded-md text-sm font-medium duration-[var(--ds-motion-normal)] " +
          "bg-[hsl(var(--ds-primary))] text-[hsl(var(--ds-primary-foreground))] " +
          "hover:bg-[hsl(var(--ds-primary))]/var(--ds-opacity-strong)",

        destructive:
          "rounded-md text-sm font-medium duration-[var(--ds-motion-normal)] " +
          "bg-[hsl(var(--ds-danger))] text-[hsl(var(--ds-text))] " +
          "hover:bg-[hsl(var(--ds-danger))]/var(--ds-opacity-strong)",

        outline:
          "rounded-md text-sm font-medium border border-[hsl(var(--ds-border))] " +
          "bg-transparent text-[hsl(var(--ds-text))] " +
          "hover:text-[hsl(var(--ds-accent-foreground))] " +
          "hover:border-[hsl(var(--ds-border))]/var(--ds-opacity-strong)",

        secondary:
          "rounded-md text-sm font-medium duration-[var(--ds-motion-normal)] " +
          "bg-[hsl(var(--ds-secondary))] text-[hsl(var(--ds-secondary-foreground))] " +
          "hover:bg-[hsl(var(--ds-secondary))]/var(--ds-opacity-strong)",

        ghost:
          "rounded-md text-sm font-medium bg-transparent " +
          "hover:bg-[hsl(var(--ds-accent))]/var(--ds-opacity-subtle) " +
          "hover:text-[hsl(var(--ds-accent-foreground))]",

        link: "text-sm font-medium text-[hsl(var(--ds-primary))] underline-offset-4 hover:underline",

        glowOutline:
          "rounded-md text-sm font-medium border border-[hsl(var(--ds-border))] " +
          "bg-transparent text-[hsl(var(--ds-text-muted))] transition-all " +
          "hover:text-[hsl(var(--ds-text))] " +
          "hover:border-[hsl(var(--ds-border))]/var(--ds-opacity-strong) " +
          "hover:bg-[hsl(var(--ds-surface-muted))]",
        toggle:
          "rounded-xl font-semibold transition-all duration-200 " +
          // default (dark mode)
          "text-dim-300 border-white/10 hover:text-dim-400 hover:border-white/40 " +
          "data-[state=on]:text-white data-[state=on]:border-white/30 data-[state=on]:bg-white/5 " +
          // light mode override
          "light:text-dim-300 light:border-black/10 light:hover:text-dim-400 light:hover:border-black/40 " +
          "light:data-[state=on]:text-black light:data-[state=on]:border-black/30 light:data-[state=on]:bg-black/5",
      },

      tone: {
        default: "",
        info:
          "bg-[hsl(var(--ds-info))] text-[hsl(var(--ds-text))] " +
          "hover:bg-[hsl(var(--ds-info))]/var(--ds-opacity-strong)",

        warning:
          "bg-[hsl(var(--ds-warning))] text-[hsl(var(--ds-text))] " +
          "hover:bg-[hsl(var(--ds-warning))]/var(--ds-opacity-strong)",

        success:
          "bg-[hsl(var(--ds-success))] text-[hsl(var(--ds-text))] " +
          "hover:bg-[hsl(var(--ds-success))]/var(--ds-opacity-strong)",

        danger:
          "bg-[hsl(var(--ds-danger))] text-[hsl(var(--ds-text))] " +
          "hover:bg-[hsl(var(--ds-danger))]/var(--ds-opacity-strong)",
      },
    },
    defaultVariants: {
      variant: "default",
      tone: "default",
    },
  },
);

export type ButtonTone = "default" | "info" | "warning" | "success" | "danger";

export interface ButtonStyle {
  border?: "sm" | "md" | "full";
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants>,
    ButtonStyle {
  asChild?: boolean;
  loading?: boolean;
  active?: boolean;
  tone?: ButtonTone;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      asChild = false,
      loading = false,
      active = false,
      tone,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            tone,
            className,
          }),
        )}
        ref={ref}
        disabled={loading || props.disabled}
        data-state={active ? "on" : "off"}
        aria-pressed={active ? true : undefined}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-1">
            <LoadingPoints circleSize="4px" glowColor="currentColor" />
          </div>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

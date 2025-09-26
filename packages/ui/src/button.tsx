import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@ashgw/ui";
import { LoadingPoints } from "./loading";

const outlineInteractive =
  "border text-dim-300 border-white/10 " +
  "hover:text-dim-400 hover:border-[hsl(var(--ds-border))]/70 hover:bg-white/[0.03] " + // subtle hover fill
  "data-[state=on]:text-white data-[state=on]:border-[hsl(var(--ds-border))]/90 " +
  "data-[state=on]:bg-white/5"; // faint inside fill on active/focus

const outlineDestructiveInteractive =
  "border text-[hsl(var(--ds-danger))] border-[hsl(var(--ds-danger))]/40 " +
  "hover:text-[hsl(var(--ds-danger))]/80 hover:border-[hsl(var(--ds-danger))]/70 hover:bg-[hsl(var(--ds-danger))]/[0.08] " +
  "data-[state=on]:text-[hsl(var(--ds-danger))] data-[state=on]:border-[hsl(var(--ds-danger))]/70 " +
  "data-[state=on]:bg-[hsl(var(--ds-danger))]/20";

const defaultInteractive =
  "rounded-md text-sm font-semibold duration-[var(--ds-motion-normal)] " +
  "bg-[hsl(var(--ds-primary))] text-[hsl(var(--ds-primary-foreground))] " +
  // hover: darken the primary a little using opacity var
  "hover:bg-[hsl(var(--ds-primary))]/[calc(1-var(--ds-opacity-medium))] " +
  // active: push it a bit darker for click feedback
  "active:bg-[hsl(var(--ds-primary))]/[calc(1-var(--ds-opacity-strong))]";

export const destructiveInteractive =
  "rounded-md text-sm font-semibold duration-[var(--ds-motion-normal)] " +
  "bg-[hsl(var(--ds-danger))] text-dim-300 " +
  // hover: dip danger color + lighten text a bit
  "hover:bg-[hsl(var(--ds-danger))]/[calc(1-var(--ds-opacity-medium))] " +
  "hover:text-dim-400 " +
  // active: push darker + force white text for contrast
  "active:bg-[hsl(var(--ds-danger))]/[calc(1-var(--ds-opacity-strong))] " +
  "active:text-white";

const buttonVariants = cva(
  "py-2 px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap " +
    "transition-colors focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-[hsl(var(--ds-ring))] focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-[hsl(var(--ds-background))] " +
    "disabled:pointer-events-none disabled:opacity-[var(--ds-opacity-extra-strong)]",
  {
    variants: {
      variant: {
        default: defaultInteractive,
        "default:rounded": defaultInteractive + " rounded-full",

        destructive:
          "rounded-md text-sm font-semibold bg-transparent " +
          destructiveInteractive,

        "destructive:outline":
          "rounded-md text-sm font-semibold bg-transparent " +
          outlineDestructiveInteractive,

        outline:
          "rounded-md text-sm font-semibold bg-transparent " +
          outlineInteractive,

        "outline:rounded":
          "rounded-md text-sm font-semibold bg-transparent " +
          outlineInteractive +
          " rounded-full",

        secondary:
          "rounded-md text-sm font-medium duration-[var(--ds-motion-normal)] " +
          "bg-[hsl(var(--ds-secondary))] text-[hsl(var(--ds-secondary-foreground))] " +
          "hover:bg-[hsl(var(--ds-secondary))]/[calc(1-var(--ds-opacity-strong))]",

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

        "outline:glow:accent":
          "rounded-md text-sm font-medium border border-[hsl(var(--ds-accent))]/40 " +
          "bg-transparent text-[hsl(var(--ds-accent-foreground))] transition-all " +
          "hover:border-[hsl(var(--ds-accent))]/70 " +
          "hover:shadow-[0_0_8px_hsl(var(--ds-accent)/0.6)] " +
          "hover:text-[hsl(var(--ds-accent-foreground))]",

        toggle:
          "rounded-full px-4 py-2 font-semibold transition-all duration-200 " +
          outlineInteractive,
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

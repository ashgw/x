import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "./cn";
import { Loading } from "./loading";

const outlineInteractive =
  "border text-dim-300 border-border " +
  "hover:text-dim-400 hover:border-border/70 hover:bg-white/[0.03] " +
  "data-[state=on]:text-white data-[state=on]:border-border/90 " +
  "data-[state=on]:bg-white/5";

const outlineDestructiveInteractive =
  "border text-destructive border-destructive/40 " +
  "hover:text-destructive/80 hover:border-destructive/70 hover:bg-destructive/[0.08] " +
  "data-[state=on]:text-destructive data-[state=on]:border-destructive/70 " +
  "data-[state=on]:bg-destructive/20";

const defaultInteractive =
  "rounded-md text-sm font-semibold duration-normal " +
  "bg-primary text-primary-foreground " +
  // hover: darken the primary a little using opacity var
  "hover:bg-primary/[calc(1-var(--ds-opacity-medium))] " +
  // active: push it a bit darker for click feedback
  "active:bg-primary/[calc(1-var(--ds-opacity-strong))]";

export const destructiveInteractive =
  "rounded-md text-sm font-semibold duration-normal " +
  "bg-destructive text-dim-300 " +
  // hover: dip danger color + lighten text a bit
  "hover:bg-destructive/[calc(1-var(--ds-opacity-medium))] " +
  "hover:text-dim-400 " +
  // active: push darker + force white text for contrast
  "active:bg-destructive/[calc(1-var(--ds-opacity-strong))] " +
  "active:text-white";

const buttonVariants = cva(
  "py-2 px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap " +
    "transition-colors focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-ring focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-background " +
    "disabled:pointer-events-none disabled:opacity-extra-strong",
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
          "rounded-md text-sm font-medium duration-normal " +
          "bg-secondary text-secondary-foreground " +
          "hover:bg-secondary/[calc(1-var(--ds-opacity-strong))]",

        ghost:
          "rounded-md text-sm font-medium bg-transparent " +
          "hover:bg-accent/var(--ds-opacity-subtle) " +
          "hover:text-accent-foreground",

        link: "text-sm font-medium text-primary underline-offset-4 hover:underline",

        glowOutline:
          "rounded-md text-sm font-medium border border-border " +
          "bg-transparent text-text-muted transition-all " +
          "hover:text-foreground " +
          "hover:border-border/var(--ds-opacity-strong) " +
          "hover:bg-surface-muted",

        "outline:glow:accent":
          "rounded-md text-sm font-medium border border-accent/40 " +
          "bg-transparent text-accent-foreground transition-all " +
          "hover:border-accent/70 " +
          "hover:shadow-glow-accent-sm " +
          "hover:text-accent-foreground",

        toggle:
          "rounded-full px-4 py-2 font-semibold transition-all duration-200 " +
          outlineInteractive,
      },

      tone: {
        default: "",
        info:
          "bg-info text-foreground " + "hover:bg-info/var(--ds-opacity-strong)",

        warning:
          "bg-warning text-foreground " +
          "hover:bg-warning/var(--ds-opacity-strong)",

        success:
          "bg-success text-foreground " +
          "hover:bg-success/var(--ds-opacity-strong)",

        danger:
          "bg-destructive text-foreground " +
          "hover:bg-destructive/var(--ds-opacity-strong)",
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
            <Loading circleSize="4px" inverted />
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

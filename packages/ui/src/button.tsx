import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@ashgw/ui";
import { LoadingPoints } from "./loading";

const buttonVariants = cva(
  // base styles: only neutral stuff that should *always* apply
  "py-2 px-4 ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "rounded-md text-sm font-medium duration-200 bg-primary/95 text-primary-foreground hover:bg-primary rounded-2xl opacity-95 hover:opacity-100",
        destructive:
          "rounded-md text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "rounded-2xl text-sm font-medium border-input hover:text-accent-foreground border bg-transparent",
        secondary:
          "rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        link: "text-sm font-medium text-primary underline-offset-4 hover:underline",

        "squared:default":
          "rounded-md border bg-background border-input text-secondary font-bold text-sm hover:bg-accent hover:text-foreground",
        "squared:outline":
          "rounded-md border bg-transparent border-input text-foreground font-bold text-sm hover:bg-accent hover:text-foreground",

        squareSolid:
          "rounded-md border bg-background border-input text-secondary font-bold text-sm hover:bg-accent hover:text-foreground",
        squareOutline:
          "rounded-md border bg-transparent border-input text-foreground font-bold text-sm hover:bg-accent hover:text-foreground",

        glowOutline:
          "rounded-md border bg-transparent text-[hsl(var(--ds-text-muted))] border-[hsl(var(--ds-border))] text-sm font-medium hover:text-[hsl(var(--ds-text))] hover:border-white/40 hover:bg-white/5 transition-all",

        toggle:
          "rounded-2xl transition-all duration-200 font-semibold " +
          "text-dim-300 border border-white/10 " +
          "hover:text-dim-400 hover:border-white/40 " +
          "data-[state=on]:text-white data-[state=on]:border-white/30 data-[state=on]:bg-white/5",
      },

      tone: {
        default: "",
        info: "bg-[hsl(var(--ds-info))] text-[hsl(var(--ds-primary-foreground))] hover:bg-[hsl(var(--ds-info))]/90",
        warning:
          "bg-[hsl(var(--ds-warning))] text-[hsl(var(--ds-primary-foreground))] hover:bg-[hsl(var(--ds-warning))]/90",
        success:
          "bg-[hsl(var(--ds-success))] text-[hsl(var(--ds-primary-foreground))] hover:bg-[hsl(var(--ds-success))]/90",
        danger:
          "bg-[hsl(var(--ds-danger))] text-[hsl(var(--ds-primary-foreground))] hover:bg-[hsl(var(--ds-danger))]/90",
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

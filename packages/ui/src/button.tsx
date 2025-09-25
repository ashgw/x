import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@ashgw/ui";
import { LoadingPoints } from "./loading";

const buttonVariants = cva(
  "ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        navbar:
          "glow-300 hover:translate-y-1 bg-primary/95 text-primary-foreground hover:bg-primary rounded-2xl font-semibold opacity-95 transition-all hover:opacity-100",
        navbarMin:
          "glow-300 duration-200 bg-primary/95 text-primary-foreground hover:bg-primary rounded-2xl font-semibold opacity-95 hover:opacity-100",

        default:
          "duration-200 bg-primary/95 text-primary-foreground hover:bg-primary rounded-2xl opacity-95 hover:opacity-100",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-input hover:text-accent-foreground rounded-2xl border bg-transparent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",

        "squared:default":
          "border-input text-secondary hover:bg-accent hover:text-foreground rounded-md border bg-background font-bold",
        "squared:outline":
          "border-input text-foreground hover:bg-accent hover:text-foreground rounded-md border bg-transparent font-bold",

        squareSolid:
          "border-input text-secondary hover:bg-accent hover:text-foreground rounded-md border bg-background font-bold",
        squareOutline:
          "border-input text-foreground hover:bg-accent hover:text-foreground rounded-md border bg-transparent font-bold",

        glowOutline:
          "border bg-transparent text-[hsl(var(--ds-text-muted))] border-[hsl(var(--ds-border))] hover:text-[hsl(var(--ds-text))] hover:border-white/40 hover:bg-white/5 transition-all",

        toggle:
          "border bg-transparent text-[hsl(var(--ds-text-muted))] border-[hsl(var(--ds-border))] data-[state=on]:text-[hsl(var(--ds-text))] data-[state=on]:border-white/30 data-[state=on]:bg-white/5 hover:border-white/40 hover:bg-white/5",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10 p-0", // square, good for circle buttons
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
      radius: {
        sm: "rounded-sm",
        md: "rounded-md",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      tone: "default",
      radius: "md",
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
      size,
      asChild = false,
      loading = false,
      active = false,
      tone,
      border,
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
            size,
            tone,
            radius: border,
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

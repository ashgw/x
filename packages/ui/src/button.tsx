import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@ashgw/ui";

import { LoadingPoints } from "./loading";

const buttonVariants = cva(
  "ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        navbar:
          "glow-300 hover:translate-y-1 bg-primary/95 text-primary-foreground hover:bg-primary rounded-[1.1rem] font-semibold opacity-95 transition-all hover:opacity-100",
        navbarMin:
          "glow-300 transition-duration-200 bg-primary/95 text-primary-foreground hover:bg-primary rounded-[1.1rem] font-semibold opacity-95 hover:opacity-100",

        default:
          "transition-duration-200 bg-primary/95 text-primary-foreground hover:bg-primary rounded-[1.1rem] opacity-95 hover:opacity-100",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-input hover:text-accent-foreground rounded-[1.1rem] border bg-transparent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        "squared:default":
          "border-input text-secondary hover:bg-accent hover:text-foreground rounded-md border bg-background font-bold",
        "squared:outline":
          "border-input text-foreground hover:bg-accent hover:text-foreground rounded-md border bg-transparent font-bold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
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

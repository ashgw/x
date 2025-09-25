import * as React from "react";
import type { VariantProps } from "@ashgw/ui";
import { cva } from "./cva";
import { cn } from "./cn";

const surfaceCardVariants = cva(
  "group flex flex-col border shadow transition-all", // base
  {
    variants: {
      variant: {
        default: "bg-background/50",
        glow: "glow-500 hover:shadow-[0px_4px_88px_0px_var(--glow-accent-strong)]",
        subtle: "hover:shadow-md",
        flat: "border-none shadow-none bg-transparent",
      },
      size: {
        default: "p-5 rounded-[2rem]", // against the preset but it's needed here
        sm: "p-3 rounded-xl",
        lg: "p-8 rounded-[2.5rem]", // same
      },
      animate: {
        none: "",
        scale: "hover:scale-105 duration-200",
        pop: "hover:scale-110 duration-200",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animate: "scale",
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surfaceCardVariants> {
  asChild?: boolean;
}

export const SurfaceCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, animate, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "section" : "div";
    return (
      <Comp
        ref={ref}
        className={cn(
          surfaceCardVariants({ variant, size, animate, className }),
        )}
        {...props}
      />
    );
  },
);
SurfaceCard.displayName = "SurfaceCard";

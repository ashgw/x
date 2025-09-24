import * as React from "react";
import type { VariantProps } from "@ashgw/ui";
import { cva } from "./cva";
import { cn } from "./cn";

const surfaceCardVariants = cva(
  "group flex flex-col border border-white/10 shadow transition-all", // base
  {
    variants: {
      variant: {
        default: "bg-background/50",
        glow: "glow-500-dimmed hover:slower-translate hover:shadow-[0px_4px_88px_0px_var(--deeper-purple)]",
        subtle: "hover:shadow-md hover:border-white/20",
        flat: "border-none shadow-none bg-transparent",
      },
      size: {
        default: "p-5 rounded-[2rem]",
        sm: "p-3 rounded-xl",
        lg: "p-8 rounded-[2.5rem]",
      },
      animate: {
        none: "",
        scale: "hover:scale-105 transition-300",
        pop: "hover:scale-110 transition-300",
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

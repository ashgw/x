"use client";

import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { cn } from "@ashgw/ui";

import "./LoadingPoints.css";

const loadingDot = cva("loading-dot rounded-full inline-block", {
  variants: {
    size: {
      sm: "w-2 h-2",
      md: "w-3 h-3",
      lg: "w-4 h-4",
    },
    color: {
      energy:
        "bg-[hsl(var(--ds-energy))] shadow-[0_0_20px_hsl(var(--ds-energy))]",
      accent:
        "bg-[hsl(var(--ds-accent))] shadow-[0_0_20px_hsl(var(--ds-accent))]",
      current: "bg-[currentColor] shadow-[0_0_20px_currentColor]",
    },
  },
  defaultVariants: {
    size: "md",
    color: "energy",
  },
});

type LoadingPointsProps = VariantProps<typeof loadingDot> & {
  count?: number;
  step?: number;
  className?: string;
};

export const LoadingPoints = React.forwardRef<
  HTMLDivElement,
  LoadingPointsProps
>(({ count = 3, step = 0.2, size, color, className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={cn(loadingDot({ size, color }))}
        style={{ "--animation-delay": `${i * step}s` } as React.CSSProperties}
      />
    ))}
  </div>
));

LoadingPoints.displayName = "LoadingPoints";

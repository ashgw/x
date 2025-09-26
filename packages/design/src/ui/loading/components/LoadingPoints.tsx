"use client";

import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { cn } from "../..";

import "./LoadingPoints.css";

const loadingDot = cva("loading-dot rounded-full inline-block", {
  variants: {
    size: {
      sm: "w-2 h-2",
      md: "w-3 h-3",
      lg: "w-4 h-4",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type LoadingPointsProps = VariantProps<typeof loadingDot> & {
  count?: number;
  step?: number;
  className?: string;
  inverted?: boolean;
};

export const LoadingPoints = React.forwardRef<
  HTMLDivElement,
  LoadingPointsProps
>(
  (
    { count = 3, step = 0.2, size, className, inverted = false, ...props },
    ref,
  ) => {
    const loadingColor = inverted
      ? "hsl(var(--ds-primary-foreground))"
      : "hsl(var(--ds-primary))";

    return (
      <div ref={ref} className={cn("flex items-center", className)} {...props}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn(loadingDot({ size }))}
            style={
              {
                "--animation-delay": `${i * step}s`,
                "--loading-color": loadingColor,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    );
  },
);

LoadingPoints.displayName = "LoadingPoints";

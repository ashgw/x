"use client";

import { LoadingPoints as LP } from "./components/LoadingPoints";

type LPSize = "sm" | "md" | "lg";
type LPColor = "energy" | "accent" | "current";

interface LoadingPointsProps {
  count?: number;
  step?: number;
  className?: string;
  size?: LPSize;
  color?: LPColor;
  glowColor?: string;
  circleSize?: string;
}

export function LoadingPoints({
  count,
  step,
  className,
  size,
  color,
  glowColor,
  circleSize,
}: LoadingPointsProps) {
  const resolvedSize: LPSize =
    size ?? (circleSize === "4px" ? "sm" : circleSize === "8px" ? "md" : "lg");

  const resolvedColor: LPColor =
    color ?? (glowColor === "currentColor" ? "current" : "accent");

  return (
    <LP
      count={count}
      step={step}
      className={className}
      size={resolvedSize}
      color={resolvedColor}
    />
  );
}

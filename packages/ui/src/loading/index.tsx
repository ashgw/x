"use client";

import { LoadingPoints as LP } from "./components/LoadingPoints";

type LPSize = "sm" | "md" | "lg";

interface LoadingPointsProps {
  count?: number;
  step?: number;
  className?: string;
  size?: LPSize;
  circleSize?: string;
}

export function LoadingPoints({
  count,
  step,
  className,
  size,
  circleSize,
}: LoadingPointsProps) {
  const resolvedSize: LPSize =
    size ?? (circleSize === "4px" ? "sm" : circleSize === "8px" ? "md" : "lg");

  return (
    <LP count={count} step={step} className={className} size={resolvedSize} />
  );
}

export function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingPoints />
    </div>
  );
}

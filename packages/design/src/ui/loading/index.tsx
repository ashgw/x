"use client";

import { LoadingPoints as LP } from "./components/LoadingPoints";

type LPSize = "sm" | "md" | "lg";

interface LoadingProps {
  className?: string;
  circleSize?: string; // e.g. "4px" | "8px" | "16px"
  inverted?: boolean;
}

export function Loading({ className, circleSize, inverted }: LoadingProps) {
  const resolvedSize: LPSize =
    circleSize === "4px" ? "sm" : circleSize === "8px" ? "md" : "lg";

  return <LP className={className} size={resolvedSize} inverted={inverted} />;
}

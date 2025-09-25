"use client";

import React from "react";
import { cn } from "./cn";

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  height = "1em",
  width = "100%",
}) => {
  return (
    <div className={cn("skeleton", className)} style={{ height, width }} />
  );
};

export { Skeleton };

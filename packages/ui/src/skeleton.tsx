"use client";

import React from "react";

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
    <div
      className={`animate-pulse rounded bg-gray-300 ${className}`}
      style={{ height, width }}
    />
  );
};

export { Skeleton };

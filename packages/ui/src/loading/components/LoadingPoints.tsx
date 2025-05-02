import React from "react";

import "./LoadingPoints.css";

const DEFAULT = {
  CIRCLE_SIZE: "8px",
  GLOW_COLOR: "rgb(155, 46, 199)", // Purple
} as const;

interface LoadingProps {
  glowColor?: string;
  circleSize?: string;
}

export const LoadingPoints: React.FC<LoadingProps> = ({
  glowColor = DEFAULT.GLOW_COLOR,
  circleSize = DEFAULT.CIRCLE_SIZE,
}) => {
  return (
    <>
      <div
        className="loading-dot"
        style={
          {
            "--glow-color": glowColor,
            "--size": circleSize,
            animationDelay: "0s",
          } as React.CSSProperties
        }
      />
      <div
        className="loading-dot"
        style={
          {
            "--glow-color": glowColor,
            "--size": circleSize,
            animationDelay: "0.2s",
          } as React.CSSProperties
        }
      />
      <div
        className="loading-dot"
        style={
          {
            "--glow-color": glowColor,
            "--size": circleSize,
            animationDelay: "0.3s",
          } as React.CSSProperties
        }
      />
    </>
  );
};

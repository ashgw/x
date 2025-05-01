"use client";

import { LoadingPoints as LP } from "./components/LoadingPoints";

export function LoadingPoints(props: {
  glowColor?: string;
  circleSize?: string;
}) {
  return (
    <LP
      glowColor={props.glowColor ?? "rgb(155, 46, 199)"}
      circleSize={props.circleSize ?? "8px"}
    />
  );
}

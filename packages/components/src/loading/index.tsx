"use client";

import { LoadingPoints } from "./components/LoadingPoints";

export function Loading(props: { glowColor?: string }) {
  return (
    <LoadingPoints
      glowColor={props.glowColor ?? "rgb(155, 46, 199)"}
      circleSize={"8px"}
    />
  );
}

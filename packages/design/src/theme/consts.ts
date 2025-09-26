import type { Theme } from "./types";
import type { UnionToTuple } from "ts-roids";

export const THEMES_TUPLE = [
  "purple",
  "red",
  "blue",
  "gray",
] satisfies UnionToTuple<Theme>;

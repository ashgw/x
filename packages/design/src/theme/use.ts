"use client";

import { useTheme as useNextTheme } from "next-themes";
import type { Theme } from "./types";
import type { MaybeUndefined } from "ts-roids";

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();

  const toggleTheme = () => {
    const currentTheme = (resolvedTheme ?? theme ?? "purple") as Theme;
    setTheme(currentTheme === "red" ? "purple" : "red");
  };

  return {
    theme: theme as MaybeUndefined<Theme>,
    setTheme: (newTheme: Theme) => setTheme(newTheme),
    resolvedTheme: resolvedTheme as MaybeUndefined<Theme>,
    toggleTheme,
  };
}

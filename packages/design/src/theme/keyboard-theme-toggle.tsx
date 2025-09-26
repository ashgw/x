"use client";

import * as React from "react";
import { useTheme } from "./use";
import { THEMES_TUPLE } from "./consts";

export function KeyboardThemeToggle(): null {
  const { setTheme, theme, resolvedTheme } = useTheme();

  React.useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k") return;
      const current = resolvedTheme ?? theme ?? "purple";
      const order = THEMES_TUPLE;
      const currentIndex = order.findIndex((theme) => theme === current);
      const nextIndex =
        currentIndex === -1 ? 0 : (currentIndex + 1) % order.length;
      const next = order[nextIndex];
      if (next) setTheme(next);
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [setTheme, theme, resolvedTheme]);

  return null;
}

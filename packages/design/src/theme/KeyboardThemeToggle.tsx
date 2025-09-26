"use client";

import * as React from "react";
import { useTheme } from "./use";

/**
 * KeyboardThemeToggle
 * Hidden helper that toggles between purple/red themes when the user presses "k".
 * Uses the theme provider for persistence and FOUC prevention.
 * Returns null; no UI is rendered.
 */
export function KeyboardThemeToggle(): null {
  const { setTheme, theme, resolvedTheme } = useTheme();

  React.useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k") return;
      const currentTheme = resolvedTheme ?? theme ?? "purple";
      setTheme(currentTheme === "red" ? "purple" : "red");
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [setTheme, theme, resolvedTheme]);

  return null;
}

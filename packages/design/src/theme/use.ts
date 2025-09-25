"use client";

import { useTheme as useNextTheme } from "next-themes";
/**
 * #### Example use case
 * ```tsx
 "use client";

import { useTheme } from "@ashgw/design/theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-md border px-4 py-2"
    >
      Toggle theme (current: {theme})
    </button>
  );
}
*```
*/
export function useTheme() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextTheme();
  return { theme, setTheme, systemTheme, resolvedTheme };
}

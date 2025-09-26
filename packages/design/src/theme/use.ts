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
      onClick={() => setTheme(theme === "red" ? "purple" : "red")}
      className="rounded-md border px-4 py-2"
    >
      Toggle theme (current: {theme})
    </button>
  );
}
*```
*/
export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();

  const toggleTheme = () => {
    const currentTheme = resolvedTheme ?? theme ?? "purple";
    setTheme(currentTheme === "red" ? "purple" : "red");
  };

  return {
    theme: theme as "purple" | "red" | undefined,
    setTheme: setTheme as (theme: "purple" | "red") => void,
    resolvedTheme: resolvedTheme as "purple" | "red" | undefined,
    toggleTheme,
  };
}

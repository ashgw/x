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
    const currentTheme = (resolvedTheme ?? theme ?? "purple") as
      | "purple"
      | "red"
      | "blue";
    setTheme(currentTheme === "red" ? "purple" : "red");
  };

  return {
    theme: theme as "purple" | "red" | "blue" | undefined,
    setTheme: (newTheme: "purple" | "red" | "blue") => setTheme(newTheme),
    resolvedTheme: resolvedTheme as "purple" | "red" | "blue" | undefined,
    toggleTheme,
  };
}

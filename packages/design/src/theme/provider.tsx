"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { Theme } from "./types";
import { THEMES_TUPLE } from "./consts";
import { KeyboardThemeToggle } from "./keyboard-theme-toggle";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "purple",
  storageKey = "ds-color-theme",
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      themes={THEMES_TUPLE}
      enableSystem={false}
      disableTransitionOnChange
    >
      <KeyboardThemeToggle />
      {children}
    </NextThemesProvider>
  );
}

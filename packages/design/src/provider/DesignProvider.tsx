"use client";

import * as React from "react";
import { useEffect } from "react";
import type { PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";
import type { ThemeSpec } from "../tokens/types";

export interface DesignProviderProps {
  theme: ThemeSpec;
  mode?: "light" | "dark" | "system";
}

function applyThemeToDocument(theme: ThemeSpec): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const setVar = (name: string, value: string) => root.style.setProperty(name, value);

  // Colors
  setVar("--ds-background", theme.colors.background);
  setVar("--ds-surface", theme.colors.surface);
  setVar("--ds-surface-muted", theme.colors.surfaceMuted);
  setVar("--ds-text", theme.colors.text);
  setVar("--ds-text-muted", theme.colors.textMuted);
  setVar("--ds-text-strong", theme.colors.textStrong);
  setVar("--ds-accent", theme.colors.accent);
  setVar("--ds-accent-foreground", theme.colors.accentForeground);
  setVar("--ds-accent-muted", theme.colors.accentMuted);
  setVar("--ds-success", theme.colors.success);
  setVar("--ds-warning", theme.colors.warning);
  setVar("--ds-danger", theme.colors.danger);
  setVar("--ds-border", theme.colors.border);
  setVar("--ds-ring", theme.colors.ring);
  setVar("--ds-glow-primary", theme.colors.glowPrimary);
  setVar("--ds-card", theme.colors.card);
  setVar("--ds-card-foreground", theme.colors.cardForeground);
  setVar("--ds-popover", theme.colors.popover);
  setVar("--ds-popover-foreground", theme.colors.popoverForeground);
  setVar("--ds-primary", theme.colors.primary);
  setVar("--ds-primary-foreground", theme.colors.primaryForeground);
  setVar("--ds-secondary", theme.colors.secondary);
  setVar("--ds-secondary-foreground", theme.colors.secondaryForeground);
  setVar("--ds-muted", theme.colors.muted);
  setVar("--ds-muted-foreground", theme.colors.mutedForeground);

  // Radii
  setVar("--ds-radius-sm", theme.radius.sm);
  setVar("--ds-radius-md", theme.radius.md);
  setVar("--ds-radius-lg", theme.radius.lg);
  setVar("--ds-radius-xl", theme.radius.xl);
  setVar("--ds-radius-2xl", theme.radius["2xl"]);

  // Motion
  setVar("--ds-motion-fast", theme.motion.fast);
  setVar("--ds-motion-normal", theme.motion.normal);
  setVar("--ds-motion-slow", theme.motion.slow);

  // Shadows
  setVar("--ds-shadow-1", theme.shadow[1]);
  setVar("--ds-shadow-2", theme.shadow[2]);
  setVar("--ds-shadow-3", theme.shadow[3]);
}

export function DesignProvider({ children, theme, mode = "system" }: PropsWithChildren<DesignProviderProps>) {
  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme={mode}>
      {children}
    </ThemeProvider>
  );
}



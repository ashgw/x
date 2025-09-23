import type { ThemeSpec } from "./types";

export const BaseTokens: Pick<
  ThemeSpec,
  "colors" | "radius" | "motion" | "shadow"
> = {
  colors: {
    background: "0 0% 100%",
    surface: "0 0% 100% / 0",
    surfaceMuted: "0 0% 96.1%",
    text: "0 0% 3.9%",
    textMuted: "0 0% 45.1%",
    textStrong: "0 0% 3.9%",
    accent: "240 5% 64%",
    accentForeground: "0 0% 100%",
    accentMuted: "240 5% 40%",
    success: "142 70% 45%",
    warning: "38 92% 50%",
    danger: "0 84.2% 60.2%",
    border: "0 0% 89.8%",
    ring: "0 0% 0% / 0",
    glowPrimary: "255 46 200 / 0.5",
    card: "0 0% 100% / 0",
    cardForeground: "0 0% 3.9%",
    popover: "0 0% 100% / 0",
    popoverForeground: "0 0% 3.9%",
    primary: "0 0% 9%",
    primaryForeground: "0 0% 98%",
    secondary: "0 0% 96.1%",
    secondaryForeground: "0 0% 9%",
    muted: "0 0% 96.1%",
    mutedForeground: "0 0% 45.1%",
  },
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
  },
  motion: { fast: "120ms", normal: "200ms", slow: "320ms" },
  shadow: {
    1: "0 1px 2px 0 rgb(0 0 0 / 0.08)",
    2: "0 4px 16px 0 rgb(0 0 0 / 0.16)",
    3: "0 8px 32px 0 rgb(0 0 0 / 0.24)",
  },
};

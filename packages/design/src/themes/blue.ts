import type { ThemeSpec } from "../tokens/types";
import { DefaultRadii } from "../tokens/radii";
import { DefaultMotion } from "../tokens/motion";
import { DefaultShadow } from "../tokens/shadow";

export const BlueTheme: ThemeSpec = {
  name: "blue",
  dark: true,
  colors: {
    background: "222 47% 11%",
    surface: "222 47% 11% / 0",
    surfaceMuted: "222 31% 15%",
    text: "210 40% 98%",
    textMuted: "215 20% 65%",
    textStrong: "210 40% 98%",
    accent: "215 70% 40%",
    accentForeground: "0 0% 100%",
    accentMuted: "215 60% 28%",
    success: "142 70% 45%",
    warning: "38 92% 50%",
    danger: "0 62.8% 30.6%",
    border: "222 31% 20%",
    ring: "0 0% 0% / 0",
    glowPrimary: "30 144 255 / 0.35",
    card: "222 47% 11% / 0",
    cardForeground: "210 40% 98%",
    popover: "222 47% 11% / 0",
    popoverForeground: "210 40% 98%",
    primary: "210 40% 98%",
    primaryForeground: "222 47% 11%",
    secondary: "222 31% 15%",
    secondaryForeground: "210 40% 98%",
    muted: "222 31% 15%",
    mutedForeground: "215 20% 65%",
  },
  radius: DefaultRadii,
  motion: DefaultMotion,
  shadow: DefaultShadow,
};

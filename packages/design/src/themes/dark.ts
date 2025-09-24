import type { ThemeSpec } from "../tokens/types";
import { DefaultRadii } from "../tokens/radii";
import { DefaultMotion } from "../tokens/motion";
import { DefaultShadow } from "../tokens/shadow";

export const DarkTheme: ThemeSpec = {
  name: "dark",
  dark: true,
  colors: {
    background: "0 0% 3.9%",
    surface: "0 0% 3.9% / 0",
    surfaceMuted: "0 0% 14.9%",
    text: "0 0% 98%",
    textMuted: "0 0% 63.9%",
    textStrong: "0 0% 98%",
    accent: "222 84% 56%",
    accentForeground: "0 0% 100%",
    accentMuted: "222 84% 45%",
    success: "142 70% 45%",
    warning: "38 92% 50%",
    danger: "0 62.8% 30.6%",
    border: "0 0% 14.9%",
    ring: "0 0% 0% / 0",
    glowPrimary: "30 144 255 / 0.35",
    card: "0 0% 3.9% / 0",
    cardForeground: "0 0% 98%",
    popover: "0 0% 3.9% / 0",
    popoverForeground: "0 0% 98%",
    primary: "0 0% 98%",
    primaryForeground: "0 0% 9%",
    secondary: "0 0% 14.9%",
    secondaryForeground: "0 0% 98%",
    muted: "0 0% 14.9%",
    mutedForeground: "0 0% 63.9%",
  },
  radius: DefaultRadii,
  motion: DefaultMotion,
  shadow: DefaultShadow,
};

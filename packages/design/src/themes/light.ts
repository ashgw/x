import type { ThemeSpec } from "../tokens/types";
import { DefaultRadii } from "../tokens/radii";
import { DefaultMotion } from "../tokens/motion";
import { DefaultShadow } from "../tokens/shadow";

export const LightTheme: ThemeSpec = {
  name: "light",
  dark: false,
  colors: {
    background: "0 0% 100%",
    surface: "0 0% 100% / 0",
    surfaceMuted: "0 0% 96.1%",
    text: "0 0% 3.9%",
    textMuted: "0 0% 45.1%",
    textStrong: "0 0% 3.9%",
    accent: "222 84% 56%",
    accentForeground: "0 0% 100%",
    accentMuted: "222 84% 45%",
    success: "142 70% 45%",
    warning: "38 92% 50%",
    danger: "0 84.2% 60.2%",
    border: "0 0% 89.8%",
    ring: "0 0% 0% / 0",
    glowPrimary: "30 144 255 / 0.35",
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
  radius: DefaultRadii,
  motion: DefaultMotion,
  shadow: DefaultShadow,
};

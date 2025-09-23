export interface ColorVars {
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  textStrong: string;
  accent: string;
  accentForeground: string;
  accentMuted: string;
  success: string;
  warning: string;
  danger: string;
  border: string;
  ring: string;
  glowPrimary: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
}

export interface Radii {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
}
export interface Motion {
  fast: string;
  normal: string;
  slow: string;
}
export interface Shadow {
  1: string;
  2: string;
  3: string;
}
export interface Typography {
  fontSansVar: string;
}

export interface ThemeSpec {
  name: string;
  colors: ColorVars;
  radius: Radii;
  motion: Motion;
  shadow: Shadow;
  typography?: Partial<Typography>;
  dark?: boolean;
}

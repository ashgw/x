/**
 * HSL tokens that back CSS custom properties with the `--ds-` prefix.
 * These are intentionally semantic (what the color is used for), not brand names.
 * All values are HSL components formatted for `hsl(var(--token))` usage, e.g. "0 0% 98%".
 */
export interface ColorVars {
  /** App background, page body */
  background: string;
  /** Transparent background surfaces (e.g., cards, panels) */
  surface: string;
  /** Muted/raised surface variant for subtle separation */
  surfaceMuted: string;
  /** Default high-contrast text color */
  text: string;
  /** Secondary/low-contrast text */
  textMuted: string;
  /** Extra-strong/high-contrast text (headings) */
  textStrong: string;
  /** Accent brand color used for highlights and interactive accents */
  accent: string;
  /** Foreground color used on top of the accent */
  accentForeground: string;
  /** Muted accent background for subtle accents (badges, pills) */
  accentMuted: string;
  /** Success state color */
  success: string;
  /** Warning state color */
  warning: string;
  /** Danger/destructive state color */
  danger: string;
  /** Subtle boundaries like dividers, inputs, outlines */
  border: string;
  /** Focus ring color (used by outline utilities) */
  ring: string;
  /** RGB components used for soft glow effects (drop-shadow) */
  glowPrimary: string;
  /** Card background */
  card: string;
  /** Card text */
  cardForeground: string;
  /** Popover/tooltip background */
  popover: string;
  /** Popover/tooltip text */
  popoverForeground: string;
  /** Primary text on neutral surfaces (e.g., buttons) */
  primary: string;
  /** Foreground used on primary surfaces */
  primaryForeground: string;
  /** Secondary surface */
  secondary: string;
  /** Foreground used on secondary surfaces */
  secondaryForeground: string;
  /** Muted surface (tags, placeholders) */
  muted: string;
  /** Foreground on muted surface */
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

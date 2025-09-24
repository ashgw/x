import type { ThemeSpec } from "../tokens/types";

function toKebabCase(input: string): string {
  return input.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Convert a ThemeSpec to a flat record of CSS variable names to values.
 * Variable names use the `--ds-` prefix (e.g., `--ds-background`).
 */
export function themeToCssVars(theme: ThemeSpec): Record<string, string> {
  const vars: Record<string, string> = {};

  // Colors
  for (const [key, value] of Object.entries(theme.colors) as [
    keyof typeof theme.colors,
    string,
  ][]) {
    const varName = `--ds-${toKebabCase(key)}`;
    vars[varName] = value;
  }

  // Radii
  for (const [key, value] of Object.entries(theme.radius) as [
    keyof typeof theme.radius,
    string,
  ][]) {
    const varName = `--ds-radius-${toKebabCase(key)}`;
    vars[varName] = value;
  }

  // Motion
  for (const [key, value] of Object.entries(theme.motion) as [
    keyof typeof theme.motion,
    string,
  ][]) {
    const varName = `--ds-motion-${toKebabCase(key)}`;
    vars[varName] = value;
  }

  // Shadow
  for (const [key, value] of Object.entries(theme.shadow) as [
    string,
    string,
  ][]) {
    const varName = `--ds-shadow-${key}`;
    vars[varName] = value;
  }

  // Legacy mappings kept for back-compat (point legacy to design tokens)
  vars["--background"] = "var(--ds-background)";
  vars["--foreground"] = "var(--ds-text)";
  vars["--card"] = "var(--ds-card)";
  vars["--card-foreground"] = "var(--ds-card-foreground)";
  vars["--popover"] = "var(--ds-popover)";
  vars["--popover-foreground"] = "var(--ds-popover-foreground)";
  vars["--primary"] = "var(--ds-primary)";
  vars["--primary-foreground"] = "var(--ds-primary-foreground)";
  vars["--secondary"] = "var(--ds-secondary)";
  vars["--secondary-foreground"] = "var(--ds-secondary-foreground)";
  vars["--muted"] = "var(--ds-muted)";
  vars["--muted-foreground"] = "var(--ds-muted-foreground)";
  vars["--accent"] = "var(--ds-accent)";
  vars["--accent-foreground"] = "var(--ds-accent-foreground)";
  vars["--destructive"] = "var(--ds-danger)";
  vars["--destructive-foreground"] = "var(--ds-text)";
  vars["--border"] = "var(--ds-border)";
  vars["--input"] = "var(--ds-border)";
  vars["--ring"] = "var(--ds-ring)";
  // Legacy radius base used by old setup
  vars["--radius"] = "var(--ds-radius-md)";

  return vars;
}

export interface ApplyThemeOptions {
  /** Element to apply variables on (defaults to document.documentElement) */
  element?: HTMLElement;
  /** Also set data-theme and toggle .dark class */
  manageThemeAttributes?: boolean;
}

/**
 * Imperatively apply a theme by setting CSS variables on the root element.
 */
export function applyTheme(
  theme: ThemeSpec,
  options?: ApplyThemeOptions,
): void {
  if (typeof window === "undefined") return;
  const root = options?.element ?? document.documentElement;
  const vars = themeToCssVars(theme);
  Object.entries(vars).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });

  if (options?.manageThemeAttributes) {
    root.setAttribute("data-theme", theme.name);
    root.classList.toggle("dark", Boolean(theme.dark));
  }
}

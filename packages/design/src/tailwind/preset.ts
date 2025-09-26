import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";

export const designPreset: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--ds-border))",
        input: "hsl(var(--ds-border))",
        ring: "hsl(var(--ds-ring))",
        background: "hsl(var(--ds-background))",
        foreground: "hsl(var(--ds-text))",
        primary: {
          DEFAULT: "hsl(var(--ds-primary))",
          foreground: "hsl(var(--ds-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--ds-secondary))",
          foreground: "hsl(var(--ds-secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--ds-danger))",
          foreground: "hsl(var(--ds-text))",
        },
        success: {
          DEFAULT: "hsl(var(--ds-success))",
          foreground: "hsl(var(--ds-text))",
        },
        info: {
          DEFAULT: "hsl(var(--ds-info))",
          foreground: "hsl(var(--ds-text))",
        },
        warning: {
          DEFAULT: "hsl(var(--ds-warning))",
          foreground: "hsl(var(--ds-text))",
        },
        muted: {
          DEFAULT: "hsl(var(--ds-muted))",
          foreground: "hsl(var(--ds-muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--ds-accent))",
          foreground: "hsl(var(--ds-accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--ds-popover))",
          foreground: "hsl(var(--ds-popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--ds-card))",
          foreground: "hsl(var(--ds-card-foreground))",
        },
      },
      borderRadius: {
        DEFAULT: "var(--ds-radius)",
        xs: "var(--ds-radius-xs)",
        sm: "var(--ds-radius-sm)",
        md: "var(--ds-radius-md)",
        lg: "var(--ds-radius-lg)",
        xl: "var(--ds-radius-xl)",
        "2xl": "var(--ds-radius-2xl)",
        "3xl": "var(--ds-radius-3xl)",
        "4xl": "var(--ds-radius-4xl)",
        full: "var(--ds-radius-full)",
      },
      boxShadow: {
        subtle: "var(--ds-shadow-subtle)",
        medium: "var(--ds-shadow-medium)",
        strong: "var(--ds-shadow-strong)",
      },
      transitionDuration: {
        fast: "var(--ds-duration-fast)",
        DEFAULT: "var(--ds-duration-normal)",
        slow: "var(--ds-duration-slow)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down var(--ds-duration-normal) ease-out",
        "accordion-up": "accordion-up var(--ds-duration-normal) ease-out",
      },
    },
  },
  plugins: [animate, typography],
} satisfies Config;

import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";

export const designPreset: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        // Core background and surface tokens
        background: "hsl(var(--ds-background))",
        surface: {
          DEFAULT: "hsl(var(--ds-surface))",
          muted: "hsl(var(--ds-surface-muted))",
        },

        // Text hierarchy
        text: {
          DEFAULT: "hsl(var(--ds-text))",
          muted: "hsl(var(--ds-text-muted))",
          strong: "hsl(var(--ds-text-strong))",
        },

        // Core interactive colors
        accent: {
          DEFAULT: "hsl(var(--ds-accent))",
          foreground: "hsl(var(--ds-accent-foreground))",
          muted: "hsl(var(--ds-accent-muted))",
        },

        success: "hsl(var(--ds-success))",
        info: "hsl(var(--ds-info))",
        warning: "hsl(var(--ds-warning))",
        danger: {
          DEFAULT: "hsl(var(--ds-danger))",
          foreground: "hsl(var(--ds-danger-foreground))",
        },

        // UI element colors
        border: "hsl(var(--ds-border))",
        ring: "hsl(var(--ds-ring))",

        // Component-specific colors
        card: {
          DEFAULT: "hsl(var(--ds-card))",
          foreground: "hsl(var(--ds-card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--ds-popover))",
          foreground: "hsl(var(--ds-popover-foreground))",
        },

        // Shadcn compatibility aliases
        foreground: "hsl(var(--ds-text))",
        input: "hsl(var(--ds-border))",
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
          foreground: "hsl(var(--ds-danger-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--ds-muted))",
          foreground: "hsl(var(--ds-muted-foreground))",
        },
      },

      // Opacity levels for color modifiers (bg-accent/subtle, text-muted/strong, etc.)
      opacity: {
        subtle: "var(--ds-opacity-subtle)",
        medium: "var(--ds-opacity-medium)",
        strong: "var(--ds-opacity-strong)",
        "extra-strong": "var(--ds-opacity-extra-strong)",
        "extra-extra-strong": "var(--ds-opacity-extra-extra-strong)",
      },

      // Layout-specific spacing (where different from Tailwind defaults)
      spacing: {
        // Layout gutters
        gutter: "var(--layout-px-default)",
        "gutter-sm": "var(--layout-px-sm)",
        "gutter-lg": "var(--layout-px-lg)",
      },

      // Max width overrides for layout containers
      maxWidth: {
        "2xl": "var(--layout-w-2xl)", // override from Tailwind's 1536px
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

      // Motion tokens
      transitionDuration: {
        fast: "var(--ds-duration-fast)",
        normal: "var(--ds-duration-normal)",
        slow: "var(--ds-duration-slow)",
        DEFAULT: "var(--ds-duration-normal)",
      },

      transitionTimingFunction: {
        // Design system easing curves
        "ease-spring": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "ease-smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
        "ease-snappy": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
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

      // Blur utilities (for backdrop effects)
      backdropBlur: {
        subtle: "var(--ds-blur-subtle)",
        medium: "var(--ds-blur-medium)",
        strong: "var(--ds-blur-strong)",
        "extra-strong": "var(--ds-blur-extra-strong)",
      },
    },
  },
  plugins: [animate, typography],
} satisfies Config;

import type { Config } from "tailwindcss";

export const baseConfig = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    // import deez too
    "../../packages/ui/src/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
} satisfies Config;

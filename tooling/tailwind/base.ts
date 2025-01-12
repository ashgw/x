import type { Config } from "tailwindcss";

export const baseConfig = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    // We need to append the path to the UI package to the content array so that
    // those classes are included correctly.
    "../../packages/ui/src/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
} satisfies Config;

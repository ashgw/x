import type { Config } from "tailwindcss";

import { designPreset } from "@ashgw/design/tailwind";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../packages/components/src/**/*.{ts,tsx}",
    "../../packages/design/src/**/*.{ts,tsx}",
  ],
  presets: [designPreset],
} satisfies Config;

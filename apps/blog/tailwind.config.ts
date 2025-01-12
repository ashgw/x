import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

import { webConfig } from "@ashgw/tailwind-config";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...webConfig.content, "../../packages/ui/src/*.{ts,tsx}"],
  presets: [webConfig],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
    },
  },
} satisfies Config;

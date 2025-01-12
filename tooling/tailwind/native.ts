import type { Config } from "tailwindcss";

import { baseConfig } from "./base";

export const nativeConfig = {
  content: baseConfig.content,
  presets: [baseConfig],
  theme: {},
} satisfies Config;

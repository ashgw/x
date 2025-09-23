import type { Config } from "tailwindcss";

import { webConfig } from "@ashgw/tailwind-config";
import { designPreset } from "@ashgw/design/tailwind";

const config = {
  content: [...webConfig.content, "../../packages/design/src/**/*.{js,ts,tsx}"],
  presets: [webConfig, designPreset],
  theme: { ...webConfig.theme },
  plugins: [...webConfig.plugins],
} satisfies Config;

export default config;

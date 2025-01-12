import type { Config } from "tailwindcss";

import { webConfig } from "@ashgw/tailwind-config";

const config = {
  content: webConfig.content,
  presets: [webConfig],
  theme: { ...webConfig.theme },
  plugins: [...webConfig.plugins],
} satisfies Config;

export default config;

import type { Config } from "tailwindcss";

import { webConfig } from "@ashgw/tailwind-config";

export default {
  content: webConfig.content,
  presets: [webConfig],
  theme: { ...webConfig.theme },
  plugins: [...webConfig.plugins],
} satisfies Config;

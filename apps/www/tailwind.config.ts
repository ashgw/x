import type { Config } from "tailwindcss";

import { designContent, designPreset } from "@ashgw/design/tailwind";

export default {
  content: [...designContent],
  presets: [designPreset],
} satisfies Config;

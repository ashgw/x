import { webConfig } from '@ashgw/tailwind-config';
import type { Config } from 'tailwindcss';

const config = {
  content: webConfig.content,
  presets: [webConfig],
  theme: { ...webConfig.theme },
  plugins: [...webConfig.plugins],
} satisfies Config;

export default config;

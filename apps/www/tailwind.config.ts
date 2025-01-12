import { webConfig } from '@ashgw/tailwind-config';
import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';

const config = {
  ...webConfig,
  plugins: [
    nextui({
      layout: {
        disabledOpacity: '0.3',
      },
    }),
  ],
} satisfies Config;

export default config;

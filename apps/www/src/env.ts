import { createEnv } from '@ashgw/ts-env';
import { config } from 'dotenv';
import { z } from 'zod';

config({ path: require('path').resolve(__dirname, '../../../.env') });

export const env = createEnv({
  vars: {
    NODE_ENV: z.enum(['production', 'development', 'staging']),
    WWW_URL: z.string().url(),
    WWW_GOOGLE_ANALYTICS_ID: z.string().min(7).startsWith('G'),
    BLOG_URL: z.string().url(),
  },
  disablePrefix: ['NODE_ENV'],
  prefix: 'NEXT_PUBLIC',
  skipValidation: false,
});

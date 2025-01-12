import { createEnv } from '@ashgw/ts-env';
import { config } from 'dotenv';
import { z } from 'zod';

config({ path: require('path').resolve(__dirname, '../../../.env') });

export const env = createEnv({
  vars: {
    NODE_ENV: z.enum(['production', 'development', 'staging']),
    WWW_URL: z.string().url(),
    BLOG_URL: z.string().url(),
    GA_ID: z.string().min(1),
  },
  disablePrefix: ['NODE_ENV'],
  prefix: 'NEXT_PUBLIC',
  skipValidation: false,
});

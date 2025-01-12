import { createEnv } from '@ashgw/ts-env';
import { z } from 'zod';

export const env = createEnv({
  vars: {
    NODE_ENV: z.enum(['production', 'development', 'staging']),
    WWW_URL: z.string().url(),
    BLOG_URL: z.string().url(),
    GENERATE_SOURCE_MAP: z.boolean(),
    GA_ID: z.string().min(1),
  },
  disablePrefix: ['NODE_ENV'],
  prefix: 'NEXT_PUBLIC',
  skipValidation: false,
});

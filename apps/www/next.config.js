import baseConfig from '@ashgw/next-config/base.js';
import { createJiti } from 'jiti';
import { fileURLToPath } from 'url';

/* 
  @see https://github.com/t3-oss/create-t3-turbo/blob/main/apps/nextjs/next.config.js
  for env vars validation
*/
// Import env files to validate at build time. Use jiti so we can load .ts files in here.
await createJiti(fileURLToPath(import.meta.url)).import('./src/env');

/** @type {import("next").NextConfig} */
const config = {
  ...baseConfig,
};

export default config;

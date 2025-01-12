import baseConfig from '@ashgw/next-config/base.js';
import { createJiti } from 'jiti';
import { fileURLToPath } from 'url';

// Import the env file to validate at build time. Use jiti so we can load .ts files in here.
await createJiti(fileURLToPath(import.meta.url)).import('./src/env');

/** @type {import("next").NextConfig} */
const config = {
  ...baseConfig,
};

export default config;

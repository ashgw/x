import { fileURLToPath } from "url";
import { createJiti } from "jiti";

// Runtime-load the TS packages using jiti
const jiti = createJiti(import.meta.url);

// Load baseConfig from TS/ESM package
const baseConfig = jiti("@ashgw/next-config/base.js");
const { sentry } = jiti("@ashgw/observability");

// Validate env at build time
jiti("@ashgw/env");

// Wrap with sentry config
const config = sentry.next.withConfig({
  nextConfig: {
    ...baseConfig,
  },
});

export default config;

import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const baseConfig = jiti("@ashgw/next-config/base.js");
const { sentry } = jiti("@ashgw/observability");

// validate at build
jiti("@ashgw/env");

const config = sentry.next.withConfig({
  /** @type {import('next').NextConfig} */
  nextConfig: {
    ...baseConfig,
  },
});

export default config;

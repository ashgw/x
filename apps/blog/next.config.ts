import type { NextConfig } from "next";

import baseConfig from "@ashgw/next-config/base.js";
import { sentry } from "@ashgw/observability";

// Import the env file to validate at build time.
import "@ashgw/env";

/** @type {import("next").NextConfig} */
const config: NextConfig = sentry.next.withConfig({
  nextConfig: {
    ...baseConfig,
  },
});

export default config;

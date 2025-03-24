import { fileURLToPath } from "url";
import { createJiti } from "jiti";

import baseConfig from "@ashgw/next-config/base.js";
import { sentry } from "@ashgw/observability";

// Import the env file to validate at build time. Use jiti so we can load .ts files in here.
await createJiti(fileURLToPath(import.meta.url)).import("@ashgw/env");

/** @type {import("next").NextConfig} */
const config = sentry.withConfig({
  ...baseConfig,
});

export default config;

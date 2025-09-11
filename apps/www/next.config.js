import { createJiti } from "jiti";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.join(__dirname, "../../");

const jiti = createJiti(import.meta.url);
const baseConfig = jiti("@ashgw/next-config/base.js");
const { monitor } = jiti("@ashgw/observability");

// validate at build
jiti("@ashgw/env");

const config = monitor.next.withConfig({
  /** @type {import('next').NextConfig} */
  nextConfig: {
    ...baseConfig,
    experimental: {
      ...(baseConfig.experimental ?? {}),
      // critical for pnpm+monorepo so .vercel/output includes `next`
      outputFileTracingRoot: monorepoRoot,
    },
  },
});

export default config;

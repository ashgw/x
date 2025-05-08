import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const baseConfig = jiti("@ashgw/next-config/base.js");
const { monitor } = jiti("@ashgw/observability");

jiti("@ashgw/env");

const config = monitor.next.withConfig({
  /** @type {import('next').NextConfig} */
  nextConfig: {
    ...baseConfig,
    experimental: {
      outputFileTracingIncludes: {
        "/": ["./public/**/*"],
      },
    },
    transpilePackages: ["next-mdx-remote"], //  this is yet anoher Next 14 specifc bug
  },
});

export default config;

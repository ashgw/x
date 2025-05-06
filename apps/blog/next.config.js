import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const baseConfig = jiti("@ashgw/next-config/base.js");
const { sentry } = jiti("@ashgw/observability");

jiti("@ashgw/env");

const config = sentry.next.withConfig({
  /** @type {import('next').NextConfig} */
  nextConfig: {
    ...baseConfig,
    experimental: {
      esmExternals: "loose",
      productionBrowserSourceMaps: true,
      pageExtensions: ["js", "ts", "jsx", "tsx", "mdx"],
    },
    transpilePackages: ["next-mdx-remote"], //  this is yet anoher Next 14 specifc bug
  },
});

export default config;

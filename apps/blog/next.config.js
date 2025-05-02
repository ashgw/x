import path from "path";
import { fileURLToPath } from "url";
import { createJiti } from "jiti";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jiti = createJiti(import.meta.url);

const baseConfig = jiti("@ashgw/next-config/base.js");
const { sentry } = jiti("@ashgw/observability");

jiti("@ashgw/env");

const config = sentry.next.withConfig({
  /** @type {import('next').NextConfig} */
  nextConfig: {
    ...baseConfig,
    experimental: {
      outputFileTracingIncludes: {
        "/": ["./public/**/*"], // problem with vercel
      },
      outputFileTracingRoot: path.join(__dirname, "../../"),
      esmExternals: "loose",
      productionBrowserSourceMaps: true,
      pageExtensions: ["js", "ts", "jsx", "tsx", "mdx"],
    },
    transpilePackages: ["next-mdx-remote"], //  this is yet anoher Next 14 specifc bug
  },
});

export default config;

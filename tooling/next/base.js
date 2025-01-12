/** @type {import("next").NextConfig} */
const baseConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  transpilePackages: ["@ashgw/ui"],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  headers() {
    return Promise.resolve([
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              `form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;`.replace(
                /\n/g,
                "",
              ),
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer, strict-origin-when-cross-origin",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Server", value: "deez nuts v69.0.1" },
          { key: "X-Powered-By", value: "deez nuts v69.0.1-pro" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "require-corp" },
        ],
      },
    ]);
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ashgw-blog-public-images.s3.us-east-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = baseConfig;

/** @type {import("next").NextConfig} */
const baseConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@ashgw/ui",
    "@ashgw/css",
    "@ashgw/env",
    "@ashgw/components",
    "@ashgw/hooks",
    "@ashgw/models",
    "@ashgw/constants",
    "@ashgw/cross-runtime",
  ],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // I talked about deez
  // https://github.com/ashgw/security-header-middlewares
  headers() {
    return Promise.resolve([
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
                form-action 'self';
                frame-ancestors 'none';
                upgrade-insecure-requests;
            `
              .split("\n")
              .join(""),
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer, strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options", // for older browsers
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Server",
            value: "deez nuts v69.0.1",
          },
          {
            key: "X-Powered-By",
            value: "deez nuts v69.0.1-pro",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "require-corp",
          },
        ],
      },
    ]);
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ashgw-blog-public-images.s3.us-east-2.amazonaws.com", // TODO: use env here
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

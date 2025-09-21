import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

import { env } from "@ashgw/env";

/**
 * Sentry configuration options for Next.js.
 * This configuration is used to set up Sentry for error tracking and performance monitoring.
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/ for all available options.
 */
const sentryConfig: Parameters<typeof withSentryConfig>[1] = {
  org: env.SENTRY_ORG,
  project: env.SENTRY_PROJECT,
  authToken: env.SENTRY_AUTH_TOKEN,
  silent: env.NODE_ENV === "production",
  debug: env.NEXT_PUBLIC_CURRENT_ENV === "development",
  sentryUrl: " https://sentry.io/", // can change if self hosted
  telemetry: false, // for privacy
  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,
  // This will unlock the capability to search for Replays in Sentry by component name
  reactComponentAnnotation: {
    enabled: true,
  },

  // /*
  //  * Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  //  * This can increase your server load as well as your hosting bill.
  //  * Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  //  * side errors will fail.
  //  */
  // tunnelRoute: "/monitoring",
  // Hides source maps from generated client bundles
  sourcemaps: {
    disable: env.NODE_ENV === "production" ? true : false,
    deleteSourcemapsAfterUpload: true,
  },
  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
};

/**
 * Wraps the provided Next.js configuration with Sentry configuration.
 *
 * @param nextConfig - The original Next.js configuration object.
 * @returns The modified configuration object with Sentry integration.
 */
export const withConfig = <NC extends NextConfig>({
  nextConfig,
}: {
  nextConfig: NC;
}): NC => {
  const nextConfigWithTranspile = {
    ...nextConfig,
    transpilePackages: ["@sentry/nextjs"],
  };

  return withSentryConfig(nextConfigWithTranspile, sentryConfig);
};

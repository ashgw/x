import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

import { env } from "@ashgw/env";

/**
 * Sentry configuration options for Next.js.
 * This configuration is used to set up Sentry for error tracking and performance monitoring.
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
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
  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // Note: Keeping this commented can avoid increased server load. Enable if you need it.
  tunnelRoute: "/monitoring",
  // Hide source maps from client bundles in production, keep them in dev for DX
  sourcemaps: {
    disable: env.NODE_ENV === "production" ? true : false,
    deleteSourcemapsAfterUpload: env.NODE_ENV === "production",
  },
  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
};

/**
 * Wraps the provided Next.js configuration with Sentry configuration.
 */
export const withConfig = <NC extends NextConfig>({
  nextConfig,
}: {
  nextConfig: NC;
}): NC => {
  const nextConfigWithTranspile = {
    ...nextConfig,
    transpilePackages: ["@sentry/nextjs"],
    // Expose the tunnel route rewrite so the client sends events to our backend path
    async rewrites() {
      const baseRewrites =
        typeof nextConfig.rewrites === "function"
          ? await nextConfig.rewrites()
          : nextConfig.rewrites;
      const extra = [
        {
          source: "/monitoring",
          destination:
            "https://o447951.ingest.sentry.io/api/:project/envelope/", // placeholder; SDK will override with DSN project
        },
      ];
      // Merge rewrites format (array or object with beforeFiles/afterFiles)
      if (Array.isArray(baseRewrites)) {
        return [...baseRewrites, ...extra];
      }
      return {
        beforeFiles: [...(baseRewrites?.beforeFiles ?? []), ...extra],
        afterFiles: baseRewrites?.afterFiles ?? [],
        fallback: baseRewrites?.fallback ?? [],
      };
    },
  } as NC;

  return withSentryConfig(nextConfigWithTranspile, sentryConfig);
};

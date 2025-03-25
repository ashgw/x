// @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs";

import { env } from "@ashgw/env";

/**
 * Initializes Sentry for error tracking and performance monitoring.
 * This function configures Sentry based on the runtime environment (server or browser).
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/initialization/ for more details on initialization.
 */
export const init = (ops: {
  runtime: "server" | "browser";
}): ReturnType<typeof Sentry.init> => {
  return Sentry.init({
    // The Data Source Name (DSN) is required to connect to your Sentry project.
    // @see https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/#dsn
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,

    // The tracesSampler function determines the sampling rate for performance monitoring.
    // @see https://docs.sentry.io/platforms/javascript/guides/nextjs/performance/#traces-sampling
    tracesSampler: () => 1,

    // The environment variable helps to distinguish between different environments (e.g., production, development).
    // @see https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/#environment
    environment: env.NODE_ENV,

    // Enables debug mode for development, providing additional logging.
    // @see https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/#debug
    debug: env.NODE_ENV === "development",

    // Enables or disables Sentry based on the environment.
    // @see https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/#enabled
    enabled: env.NODE_ENV === "production",

    // Sample rate for replays on error, controlling how often replays are recorded.
    // @see https://docs.sentry.io/platforms/javascript/guides/nextjs/replays/#replays-on-error-sample-rate
    replaysOnErrorSampleRate: 1.0,

    // Sample rate for session replays, controlling how often sessions are recorded.
    // @see https://docs.sentry.io/platforms/javascript/guides/nextjs/replays/#replays-session-sample-rate
    replaysSessionSampleRate: 0.1,

    integrations: [
      // add the posthog integration when the bug gets resolved
      ...(ops.runtime === "browser"
        ? [
            // The replay integration captures user interactions and errors in the browser.
            // @see https://docs.sentry.io/platforms/javascript/guides/nextjs/replays/
            Sentry.replayIntegration({
              // Masks all text in the replay to protect sensitive information.
              // @see https://docs.sentry.io/platforms/javascript/guides/nextjs/replays/#masking
              maskAllText: true,
              // Blocks all media in the replay to protect sensitive information.
              // @see https://docs.sentry.io/platforms/javascript/guides/nextjs/replays/#blocking-media
              blockAllMedia: true,
            }),
          ]
        : []),
    ],
  });
};

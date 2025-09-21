// @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
import { env } from "@ashgw/env";
import { logger } from "@ashgw/logger";
import { init as SentryInit, replayIntegration } from "@sentry/nextjs";

/**
 * Initializes Sentry for error tracking and performance monitoring.
 * This function configures Sentry based on the runtime environment (server or browser).
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/initialization/ for more details on initialization.
 */
export const init = ({
  runtime, // use these when using the replay integration, but i use it with Posthog anyway
}: {
  runtime: "server" | "browser";
}): ReturnType<typeof SentryInit> => {
  logger.info(runtime);
  return SentryInit({
    // The Data Source Name (DSN) is required to connect to your Sentry project.
    // @see https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/#dsn
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,

    // The tracesSampler function determines the sampling rate for performance monitoring.
    // @see https://docs.sentry.io/platforms/javascript/guides/nextjs/performance/#traces-sampling
    // Capture 10% of traces
    tracesSampler: () => (Math.random() < 0.1 ? 1 : 0),

    // The environment variable helps to distinguish between different environments (e.g., production, development).
    // @see https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/#environment
    environment: env.NEXT_PUBLIC_CURRENT_ENV,

    // Enables debug mode for development, providing additional logging.
    // @see https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/#debug
    debug: env.NEXT_PUBLIC_CURRENT_ENV === "development",

    // Enables or disables Sentry based on the environment.
    // @see https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/#enabled
    enabled: env.NEXT_PUBLIC_CURRENT_ENV === "production",

    // Sample rate for replays on error, controlling how often replays are recorded.
    // @see https://docs.sentry.io/platforms/javascript/guides/nextjs/replays/#replays-on-error-sample-rate
    replaysOnErrorSampleRate: 1.0,

    // Sample rate for session replays, controlling how often sessions are recorded.
    // @see https://docs.sentry.io/platforms/javascript/guides/nextjs/replays/#replays-session-sample-rate
    replaysSessionSampleRate: 0.1,
    integrations: [
      replayIntegration({
        flushMaxDelay: 1000,
        maxReplayDuration: 45 * 60 * 1000, // 45 minutes
        minReplayDuration: 7 * 1000, // 7 seconds
        onError: (error) => {
          logger.error("Sentry replay error", error, {
            service: "Sentry Replay",
          });
        },
      }),
    ],
  });
};

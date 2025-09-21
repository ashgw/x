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
  runtime,
}: {
  runtime: "server" | "browser";
}): ReturnType<typeof SentryInit> => {
  const currentEnv = env.NEXT_PUBLIC_CURRENT_ENV;
  const isDevelopment = currentEnv === "development";
  const isProduction = currentEnv === "production";

  const tracesSampleRate = isProduction ? 0.1 : 1.0;
  const profilesSampleRate = isProduction ? 0.1 : 1.0;
  const replaysSessionSampleRate = isProduction ? 0.1 : 0.2;
  const replaysOnErrorSampleRate = 1.0;

  logger.info(`sentry:init:${runtime}`);

  return SentryInit({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,

    // Environment and enabling
    environment: currentEnv,
    debug: isDevelopment,
    enabled:
      Boolean(env.NEXT_PUBLIC_SENTRY_DSN) && currentEnv !== "development",

    // Performance & Profiling
    tracesSampleRate,
    profilesSampleRate,
    tracePropagationTargets: [
      env.NEXT_PUBLIC_WWW_URL,
      env.NEXT_PUBLIC_BLOG_URL,
      "localhost",
      "127.0.0.1",
    ],

    // Replays (browser only)
    replaysSessionSampleRate,
    replaysOnErrorSampleRate,

    // PII scrubbing and event hygiene
    beforeSend(event) {
      const headers = event.request?.headers as
        | Record<string, string>
        | undefined;
      if (headers) {
        delete headers.cookie;
        delete headers.authorization;
      }
      return event;
    },

    ignoreErrors: [
      // common benign browser errors
      "ResizeObserver loop limit exceeded",
      "Non-Error promise rejection captured",
      /network\s?error/i,
    ],

    integrations: [
      // Only include Replay in the browser runtime
      ...(runtime === "browser"
        ? [
            replayIntegration({
              flushMaxDelay: 1000,
              maxReplayDuration: 45 * 60 * 1000,
              minReplayDuration: 7 * 1000,
              onError: (error) => {
                logger.error("Sentry replay error", error, {
                  service: "Sentry Replay",
                });
              },
            }),
          ]
        : []),
    ],
  });
};

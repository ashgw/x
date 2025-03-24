// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import { init as initSentry } from "@sentry/nextjs";

import { env } from "@ashgw/env";

export const init = (): ReturnType<typeof initSentry> => {
  return initSentry({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampler: () => 1,
    environment: env.NODE_ENV,
    debug: env.NODE_ENV === "development",
    enabled: env.NODE_ENV === "production",
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
  });
};

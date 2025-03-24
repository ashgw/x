// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { init } from "@sentry/nextjs";

import { env } from "@ashgw/env";

export const initSentry = (): ReturnType<typeof init> => {
  return init({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampler: () => 1,
    debug: env.NODE_ENV === "development",
    enabled: env.NODE_ENV === "production",
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
  });
};

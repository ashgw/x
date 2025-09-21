import { monitor } from "@ashgw/monitor";

// Only export Sentry's request-error hook. Sentry itself is initialized by Next
// through the sentry.*.config.ts files, not here.
export const onRequestError = monitor.next.SentryLib.captureRequestError;

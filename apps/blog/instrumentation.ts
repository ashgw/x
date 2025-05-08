import { env } from "@ashgw/env";
import { monitor } from "@ashgw/observability";

export async function register() {
  if (env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = monitor.next.SentryLib.captureRequestError;

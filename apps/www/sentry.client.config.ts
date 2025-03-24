import { sentry } from "@ashgw/observability";

export function register() {
  sentry.init();
}

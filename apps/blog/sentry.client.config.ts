import { monitor } from "@ashgw/observability";

export function register() {
  monitor.next.init({
    runtime: "browser",
  });
}

import type { NextRequest } from "next/server";
import { monitor } from "@ashgw/monitor";

/**
 * Sentry tunnel endpoint to bypass ad blockers.
 * This endpoint forwards all requests to Sentry's ingest API.
 * @see https://docs.sentry.io/platforms/javascript/troubleshooting/#dealing-with-ad-blockers
 */
export function POST(request: NextRequest): Promise<Response> {
  const handle = monitor.next.tunnelHandler as (
    request: NextRequest,
  ) => Promise<Response>;
  return handle(request);
}

// Also handle GET requests (though Sentry typically uses POST)
export function GET(): Response {
  const health = monitor.next.tunnelHandlerHealthcheck as () => Response;
  return health();
}

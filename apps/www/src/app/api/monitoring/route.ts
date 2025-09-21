import type { NextRequest } from "next/server";
import { logger } from "@ashgw/logger";
import { z } from "zod";

/**
 * Sentry tunnel endpoint to bypass ad blockers.
 * This endpoint forwards all requests to Sentry's ingest API.
 * @see https://docs.sentry.io/platforms/javascript/troubleshooting/#dealing-with-ad-blockers
 */
export async function POST(request: NextRequest) {
  try {
    const envelope: string = await request.text();
    if (!envelope) {
      logger.warn("Sentry tunnel: Empty envelope body");
      return new Response("Bad Request: Empty body", { status: 400 });
    }

    const lines: string[] = envelope.split("\n");
    const headerLine: string | undefined = lines[0];
    if (!headerLine) {
      logger.warn("Sentry tunnel: Missing envelope header line");
      return new Response("Bad Request: Missing header", { status: 400 });
    }

    const headerUnknown: unknown = JSON.parse(headerLine);

    const headerSchema = z.object({ dsn: z.string().url() });
    const headerParse = headerSchema.safeParse(headerUnknown);
    if (!headerParse.success) {
      logger.warn("Sentry tunnel: Invalid header JSON", {
        issues: headerParse.error.issues,
      });
      return new Response("Bad Request: Invalid header", { status: 400 });
    }

    // Extract the DSN from the header
    const dsn: string = headerParse.data.dsn;
    if (!dsn) {
      logger.warn("Sentry tunnel: No DSN found in envelope header");
      return new Response("Bad Request: No DSN", { status: 400 });
    }

    // Parse the DSN to get the project ID and ingest URL
    const dsnUrl: URL = new URL(dsn);
    const projectId: string | undefined = dsnUrl.pathname.split("/").pop();

    if (!projectId) {
      logger.warn("Sentry tunnel: Could not extract project ID from DSN");
      return new Response("Bad Request: Invalid DSN", { status: 400 });
    }

    // Construct the Sentry ingest URL
    const sentryIngestUrl = `https://${dsnUrl.host}/api/${projectId}/envelope/`;

    // Forward the envelope to Sentry
    const response = await fetch(sentryIngestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-sentry-envelope",
      },
      body: envelope,
    });

    if (!response.ok) {
      logger.error("Sentry tunnel: Failed to forward envelope", {
        status: response.status,
        statusText: response.statusText,
      });
      return new Response("Internal Server Error", { status: 500 });
    }

    logger.info("Sentry tunnel: Successfully forwarded envelope", {
      projectId,
      envelopeSize: envelope.length,
    });

    return new Response("OK", { status: 200 });
  } catch (error) {
    logger.error("Sentry tunnel: Error processing request", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Also handle GET requests (though Sentry typically uses POST)
export function GET() {
  return new Response("Sentry Tunnel Endpoint", { status: 200 });
}

import { z } from "zod";
import { c } from "~/ts-rest/root";
import { createSchemaResponses, httpErrorSchema } from "~/@ashgw/ts-rest";
import type { InferResponses } from "~/@ashgw/ts-rest";

// ========== Schemas ==========

export const healthCheckSchemaResponses = createSchemaResponses({
  200: c.noBody(),
});

const fetchContentFromUpstreamSchemaResponses = createSchemaResponses({
  424: httpErrorSchema.upstream().describe("Upstream failed to serve content"),
  500: httpErrorSchema.internal().describe("Unexpected internal failure"),
});

export const fetchTextFromUpstreamSchemaResponses = createSchemaResponses({
  200: c.otherResponse({ contentType: "text/plain", body: z.string().min(1) }),
  ...fetchContentFromUpstreamSchemaResponses,
});

export const fetchGpgFromUpstreamSchemaResponses = createSchemaResponses({
  200: c.otherResponse({
    contentType: "application/pgp-keys",
    body: z.string().min(1),
  }),
  ...fetchContentFromUpstreamSchemaResponses,
});

export const cronAuthedMiddlewareSchemaResponse = createSchemaResponses({
  401: httpErrorSchema
    .unauthorized()
    .describe("Missing or invalid x-cron-token"),
});

export const rateLimiterMiddlwareSchemaResponse = createSchemaResponses({
  429: httpErrorSchema.tooManyRequests().describe("Rate limited"),
});

export const purgeViewWindowSchemaResponses = createSchemaResponses({
  200: c.noBody(),
  500: httpErrorSchema.internal(),
  ...cronAuthedMiddlewareSchemaResponse,
  ...rateLimiterMiddlwareSchemaResponse,
});

// ========== Types ==========

export type HealthCheckResponses = InferResponses<
  typeof healthCheckSchemaResponses
>;

export type FetchTextFromUpstreamResponses = InferResponses<
  typeof fetchTextFromUpstreamSchemaResponses
>;

export type FetchGpgFromUpstreamResponses = InferResponses<
  typeof fetchGpgFromUpstreamSchemaResponses
>;

export type PurgeViewWindowResponses = InferResponses<
  typeof purgeViewWindowSchemaResponses
>;

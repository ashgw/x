import { z } from "zod";
import { c } from "~/ts-rest/root";
import { createSchemaResponses, httpError } from "~/@ashgw/ts-rest";
import type { InferResponses } from "~/@ashgw/ts-rest";

// ========== Schemas ==========

export const healthCheckSchemaResponses = createSchemaResponses({
  200: c.noBody(),
});

const fetchContentFromUpstreamSchemaResponses = createSchemaResponses({
  424: httpError.upstream().describe("Upstream failed to serve content"),
  500: httpError.internal().describe("Unexpected internal failure"),
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

// middleware errors you want documented for routes that use them
export const cronAuthedMiddlewareSchemaResponse = createSchemaResponses({
  401: httpError.unauthorized().describe("Missing or invalid x-cron-token"),
});

export const purgeViewWindowSchemaResponses = createSchemaResponses({
  200: c.noBody(),
  401: httpError.unauthorized().describe("Missing or invalid cron auth"),
  429: httpError.tooManyRequests().describe("Rate limited"),
  500: httpError.internal(),
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

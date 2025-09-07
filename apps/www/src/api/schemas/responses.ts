import { z } from "zod";
import type { InferResponses } from "../types";
import { c } from "../root";

// ========== Schemas ==========

const httpErrorSchemaRo = z.object({
  code: z
    .enum([
      "UPSTREAM_ERROR",
      "INTERNAL_ERROR",
      "BAD_REQUEST",
      "NOT_FOUND",
      "UNAUTHORIZED",
      "FORBIDDEN",
    ])
    .describe("Stable, machine-parseable error code"),
  message: z.string().min(1).max(1000).describe("Human readable"),
  details: z.record(z.any()).optional().describe("Optional extra context"),
});

export const checkHealthSchemaResponses = {
  200: c.noBody(),
} as const;

const fetchContentFromUpstreamSchemaResponses = {
  500: httpErrorSchemaRo,
  424: httpErrorSchemaRo,
} as const;

export const fetchTextFromUpstreamSchemaResponses = {
  200: c.otherResponse({ contentType: "text/plain", body: z.string().min(1) }),
  ...fetchContentFromUpstreamSchemaResponses,
} as const;

export const fetchGpgFromUpstreamSchemaResponses = {
  200: c.otherResponse({
    contentType: "application/pgp-keys",
    body: z.string().min(1),
  }),
  ...fetchContentFromUpstreamSchemaResponses,
} as const;

// ========== Types ==========

export type CheckHealthResponses = InferResponses<
  typeof checkHealthSchemaResponses
>;

export type FetchTextFromUpstreamResponses = InferResponses<
  typeof fetchTextFromUpstreamSchemaResponses
>;

export type FetchGpgFromUpstreamResponses = InferResponses<
  typeof fetchGpgFromUpstreamSchemaResponses
>;

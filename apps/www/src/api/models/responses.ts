import { z } from "zod";
import type { InferResponses } from "../types";
import { c } from "../root";

// ========== Schemas ==========

const httpErrorSchemaResponses = z.object({
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
  200: z.object({ ping: z.literal("pong") }),
};

const fetchContentFromUpstreamSchemaResponses = {
  500: httpErrorSchemaResponses,
  424: httpErrorSchemaResponses,
};

export const fetchTextFromUpstreamSchemaResponses = {
  200: c.otherResponse({ contentType: "text/plain", body: z.string().min(1) }),
  ...fetchContentFromUpstreamSchemaResponses,
};

export const fetchGpgFromUpstreamSchemaResponses = {
  200: c.otherResponse({
    contentType: "application/pgp-keys",
    body: z.string().min(1),
  }),
  ...fetchContentFromUpstreamSchemaResponses,
};

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

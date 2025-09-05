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

export const checkHealthSchemaRos = {
  200: z.object({ ping: z.literal("pong") }),
};

const fetchContentFromUpstreamSchemaRos = {
  500: httpErrorSchemaRo,
  424: httpErrorSchemaRo,
};

export const fetchTextFromUpstreamSchemaRos = {
  200: c.otherResponse({ contentType: "text/plain", body: z.string().min(1) }),
  ...fetchContentFromUpstreamSchemaRos,
};

export const fetchGpgFromUpstreamSchemaRos = {
  200: c.otherResponse({
    contentType: "application/pgp-keys",
    body: z.string().min(1),
  }),
  ...fetchContentFromUpstreamSchemaRos,
};

// ========== Types ==========

export type CheckHealthRos = InferResponses<typeof checkHealthSchemaRos>;

export type FetchTextFromUpstreamRos = InferResponses<
  typeof fetchTextFromUpstreamSchemaRos
>;

export type FetchGpgFromUpstreamRos = InferResponses<
  typeof fetchGpgFromUpstreamSchemaRos
>;

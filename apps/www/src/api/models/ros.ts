import { z } from "zod";
import type { InferResponses } from "../types";

// ========== Schemas ==========

const httpErrorSchema = z.object({
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
  500: httpErrorSchema,
};

export const fetchTextFromUpstreamSchemaResponses = {
  200: z.string().min(1),
  500: httpErrorSchema,
  424: httpErrorSchema,
};

// ========== Types ==========

export type CheckHealthResponses = InferResponses<
  typeof checkHealthSchemaResponses
>;

export type FetchTextFromUpstreamResponses = InferResponses<
  typeof fetchTextFromUpstreamSchemaResponses
>;

import { z } from "zod";
import { c } from "~/ts-rest/root";
import { createSchemaResponses, httpErrorSchema } from "ts-rest-kit/core";
import { internalErrorSchemaResponse } from "../shared/responses";
import type { InferResponses } from "ts-rest-kit/core";

// ========== Schemas ==========

const fetchContentFromUpstreamSchemaResponses = createSchemaResponses({
  424: httpErrorSchema
    .upstream()
    .describe("Upstream failed to serve content (e.g. GitHub raw URL error)"),
  ...internalErrorSchemaResponse,
});

export const fetchTextFromUpstreamSchemaResponses = createSchemaResponses({
  200: c.otherResponse({
    contentType: "text/plain",
    body: z.string().min(1).describe("Raw text body returned by upstream"),
  }),
  ...fetchContentFromUpstreamSchemaResponses,
});

export const fetchGpgFromUpstreamSchemaResponses = createSchemaResponses({
  200: c.otherResponse({
    contentType: "application/pgp-keys",
    body: z
      .string()
      .min(1)
      .describe("Armored PGP public key block in text format"),
  }),
  ...fetchContentFromUpstreamSchemaResponses,
});

// ========== Types ==========

export type FetchTextFromUpstreamResponses = InferResponses<
  typeof fetchTextFromUpstreamSchemaResponses
>;

export type FetchGpgFromUpstreamResponses = InferResponses<
  typeof fetchGpgFromUpstreamSchemaResponses
>;

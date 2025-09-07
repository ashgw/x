import { z } from "zod";
import type { InferResponses } from "../extended";
import { schemaResponse } from "../extended";
import { c } from "../root";
import { httpErrorSchemaRo } from "./ros";

// ========== Schemas ==========

export const checkHealthSchemaResponses = schemaResponse({
  200: c.noBody(),
});

const fetchContentFromUpstreamSchemaResponses = schemaResponse({
  500: httpErrorSchemaRo,
  424: httpErrorSchemaRo,
});

export const fetchTextFromUpstreamSchemaResponses = schemaResponse({
  200: c.otherResponse({ contentType: "text/plain", body: z.string().min(1) }),
  ...fetchContentFromUpstreamSchemaResponses,
});

export const fetchGpgFromUpstreamSchemaResponses = schemaResponse({
  200: c.otherResponse({
    contentType: "application/pgp-keys",
    body: z.string().min(1),
  }),
  ...fetchContentFromUpstreamSchemaResponses,
});

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

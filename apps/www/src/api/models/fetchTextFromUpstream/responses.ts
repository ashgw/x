// TODO: to each schema we need to add as many docs as possible so the openAPI defintion
// becomes rich so AI can use it
import { z } from "zod";
import { c } from "~/ts-rest/root";
import { createSchemaResponses, httpErrorSchema } from "~/@ashgw/ts-rest";
import { internalErrorSchemaResponse } from "../_shared/responses";
import type { InferResponses } from "~/@ashgw/ts-rest";

// ========== Schemas ==========

const fetchContentFromUpstreamSchemaResponses = createSchemaResponses({
  424: httpErrorSchema.upstream().describe("Upstream failed to serve content"),
  ...internalErrorSchemaResponse,
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

// ========== Types ==========

export type FetchTextFromUpstreamResponses = InferResponses<
  typeof fetchTextFromUpstreamSchemaResponses
>;

export type FetchGpgFromUpstreamResponses = InferResponses<
  typeof fetchGpgFromUpstreamSchemaResponses
>;

import { z } from "zod";
import { c } from "../root";
import { createSchemaResponses, httpErrorSchema } from "~/@ashgw/ts-rest";
import type { InferResponses } from "~/@ashgw/ts-rest";

// ========== Schemas ==========

export const healthCheckSchemaResponses = createSchemaResponses({
  200: c.noBody(),
});

const fetchContentFromUpstreamSchemaResponses = createSchemaResponses({
  500: httpErrorSchema,
  424: httpErrorSchema,
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

export const purgeViewWindowSchemaResponses = createSchemaResponses({
  200: c.noBody(),
  401: httpErrorSchema,
  500: httpErrorSchema,
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

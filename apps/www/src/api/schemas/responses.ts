import { z } from "zod";
import type { InferResponses } from "../extended";
import { restSchemaResponse } from "../extended";
import { c } from "../root";
import { httpErrorSchemaRo } from "./ros";

// ========== Schemas ==========

export const healthCheckSchemaResponses = restSchemaResponse({
  200: c.noBody(),
});

const fetchContentFromUpstreamSchemaResponses = restSchemaResponse({
  500: httpErrorSchemaRo,
  424: httpErrorSchemaRo,
});

export const fetchTextFromUpstreamSchemaResponses = restSchemaResponse({
  200: c.otherResponse({ contentType: "text/plain", body: z.string().min(1) }),
  ...fetchContentFromUpstreamSchemaResponses,
});

export const fetchGpgFromUpstreamSchemaResponses = restSchemaResponse({
  200: c.otherResponse({
    contentType: "application/pgp-keys",
    body: z.string().min(1),
  }),
  ...fetchContentFromUpstreamSchemaResponses,
});

export const purgeViewWindowSchemaResponses = restSchemaResponse({
  200: c.noBody(),
  401: httpErrorSchemaRo,
  500: httpErrorSchemaRo,
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

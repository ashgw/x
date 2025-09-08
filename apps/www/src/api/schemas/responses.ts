import { z } from "zod";
import type { InferResponses } from "../extended";
import { makeSchemaResponse } from "../extended";
import { c } from "../root";
import { httpErrorSchemaRo } from "./ros";

// ========== Schemas ==========

export const healthCheckSchemaResponses = makeSchemaResponse({
  200: c.noBody(),
});

const fetchContentFromUpstreamSchemaResponses = makeSchemaResponse({
  500: httpErrorSchemaRo,
  424: httpErrorSchemaRo,
});

export const fetchTextFromUpstreamSchemaResponses = makeSchemaResponse({
  200: c.otherResponse({ contentType: "text/plain", body: z.string().min(1) }),
  ...fetchContentFromUpstreamSchemaResponses,
});

export const fetchGpgFromUpstreamSchemaResponses = makeSchemaResponse({
  200: c.otherResponse({
    contentType: "application/pgp-keys",
    body: z.string().min(1),
  }),
  ...fetchContentFromUpstreamSchemaResponses,
});

export const purgeViewWindowSchemaResponses = makeSchemaResponse({
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

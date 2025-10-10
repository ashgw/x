import type { InferResponses } from "ts-rest-kit/core";
import { createSchemaResponses } from "ts-rest-kit/core";
import {
  authedMiddlewareSchemaResponse,
  internalErrorSchemaResponse,
  rateLimiterMiddlewareSchemaResponse,
  noContentSchemaResponse,
} from "../shared/responses";

export const purgeViewWindowSchemaResponses = createSchemaResponses({
  ...rateLimiterMiddlewareSchemaResponse,
  ...authedMiddlewareSchemaResponse,
  ...noContentSchemaResponse,
  ...internalErrorSchemaResponse,
});

export type PurgeViewWindowResponses = InferResponses<
  typeof purgeViewWindowSchemaResponses
>;

import type { InferResponses } from "~/@ashgw/ts-rest";
import { createSchemaResponses } from "~/@ashgw/ts-rest";
import {
  cronAuthedMiddlewareSchemaResponse,
  internalErrorSchemaResponse,
  rateLimiterMiddlwareSchemaResponse,
  noContentSchemaResponse,
} from "../../shared/responses";

export const purgeViewWindowSchemaResponses = createSchemaResponses({
  ...rateLimiterMiddlwareSchemaResponse,
  ...cronAuthedMiddlewareSchemaResponse,
  ...noContentSchemaResponse,
  ...internalErrorSchemaResponse,
});

export type PurgeViewWindowResponses = InferResponses<
  typeof purgeViewWindowSchemaResponses
>;

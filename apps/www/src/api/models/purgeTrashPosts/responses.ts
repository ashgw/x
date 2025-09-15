import type { InferResponses } from "~/@ashgw/ts-rest";
import { createSchemaResponses } from "~/@ashgw/ts-rest";
import {
  cronAuthedMiddlewareSchemaResponse,
  internalErrorSchemaResponse,
  rateLimiterMiddlewareSchemaResponse,
  noContentSchemaResponse,
} from "../shared/responses";

export const purgeTrashPostsSchemaResponses = createSchemaResponses({
  ...rateLimiterMiddlewareSchemaResponse,
  ...cronAuthedMiddlewareSchemaResponse,
  ...noContentSchemaResponse,
  ...internalErrorSchemaResponse,
});

export type PurgeTrashPostsResponses = InferResponses<
  typeof purgeTrashPostsSchemaResponses
>;

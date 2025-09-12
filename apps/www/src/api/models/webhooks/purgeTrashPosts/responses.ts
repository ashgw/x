import type { InferResponses } from "~/@ashgw/ts-rest";
import { createSchemaResponses } from "~/@ashgw/ts-rest";
import {
  cronAuthedMiddlewareSchemaResponse,
  internalErrorSchemaResponse,
  okSchemaResponse,
  rateLimiterMiddlwareSchemaResponse,
} from "../../shared/responses";

export const purgeTrashPostsSchemaResponses = createSchemaResponses({
  ...rateLimiterMiddlwareSchemaResponse,
  ...cronAuthedMiddlewareSchemaResponse,
  ...okSchemaResponse,
  ...internalErrorSchemaResponse,
});

export type PurgeTrashPostsResponses = InferResponses<
  typeof purgeTrashPostsSchemaResponses
>;

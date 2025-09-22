import type { InferResponses } from "~/ts-rest-kit";
import { createSchemaResponses } from "~/ts-rest-kit";
import {
  authedMiddlewareSchemaResponse,
  internalErrorSchemaResponse,
  rateLimiterMiddlewareSchemaResponse,
  noContentSchemaResponse,
} from "../shared/responses";

export const purgeTrashPostsSchemaResponses = createSchemaResponses({
  ...rateLimiterMiddlewareSchemaResponse,
  ...authedMiddlewareSchemaResponse,
  ...noContentSchemaResponse,
  ...internalErrorSchemaResponse,
});

export type PurgeTrashPostsResponses = InferResponses<
  typeof purgeTrashPostsSchemaResponses
>;

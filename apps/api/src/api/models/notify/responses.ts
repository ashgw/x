import type { InferResponses } from "ts-rest-kit/core";
import { createSchemaResponses } from "ts-rest-kit/core";
import {
  authedMiddlewareSchemaResponse,
  internalErrorSchemaResponse,
  okSchemaResponse,
  rateLimiterMiddlewareSchemaResponse,
} from "~/api/models/shared/responses";

export const notifySchemaResponses = createSchemaResponses({
  ...rateLimiterMiddlewareSchemaResponse,
  ...authedMiddlewareSchemaResponse,
  ...okSchemaResponse,
  ...internalErrorSchemaResponse,
});

export type NotifyResponses = InferResponses<typeof notifySchemaResponses>;

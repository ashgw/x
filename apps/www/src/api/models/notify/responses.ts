import type { InferResponses } from "ts-rest-kit";
import { createSchemaResponses } from "ts-rest-kit";
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

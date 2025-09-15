import type { InferResponses } from "~/@ashgw/ts-rest";
import { createSchemaResponses } from "~/@ashgw/ts-rest";
import {
  cronAuthedMiddlewareSchemaResponse,
  internalErrorSchemaResponse,
  okSchemaResponse,
  rateLimiterMiddlewareSchemaResponse,
} from "~/api/models/shared/responses";

export const notifySchemaResponses = createSchemaResponses({
  ...rateLimiterMiddlewareSchemaResponse,
  ...cronAuthedMiddlewareSchemaResponse,
  ...okSchemaResponse,
  ...internalErrorSchemaResponse,
});

export type NotifyResponses = InferResponses<typeof notifySchemaResponses>;

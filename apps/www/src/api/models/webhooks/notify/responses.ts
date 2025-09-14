import type { InferResponses } from "~/@ashgw/ts-rest";
import { createSchemaResponses } from "~/@ashgw/ts-rest";
import {
  cronAuthedMiddlewareSchemaResponse,
  internalErrorSchemaResponse,
  okSchemaResponse,
  rateLimiterMiddlewareSchemaResponse,
} from "../../shared/responses";

export const notifySchemaResponses = createSchemaResponses({
  ...okSchemaResponse,
  ...internalErrorSchemaResponse,
  ...rateLimiterMiddlewareSchemaResponse,
  ...cronAuthedMiddlewareSchemaResponse,
});

export type NotifyResponses = InferResponses<typeof notifySchemaResponses>;

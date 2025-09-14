import type { InferResponses } from "~/@ashgw/ts-rest";
import { createSchemaResponses } from "~/@ashgw/ts-rest";
import {
  cronAuthedMiddlewareSchemaResponse,
  internalErrorSchemaResponse,
  noContentSchemaResponse,
  rateLimiterMiddlewareSchemaResponse,
} from "../../shared/responses";

export const notifySchemaResponses = createSchemaResponses({
  ...internalErrorSchemaResponse,
  ...noContentSchemaResponse,
  ...rateLimiterMiddlewareSchemaResponse,
  ...cronAuthedMiddlewareSchemaResponse,
});

export type NotifyResponses = InferResponses<typeof notifySchemaResponses>;

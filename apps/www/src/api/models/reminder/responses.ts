import type { InferResponses } from "~/@ashgw/ts-rest";
import { createSchemaResponses } from "~/@ashgw/ts-rest";
import {
  authedMiddlewareSchemaResponse,
  internalErrorSchemaResponse,
  okSchemaResponse,
  rateLimiterMiddlewareSchemaResponse,
} from "~/api/models/shared/responses";

export const reminderSchemaResponses = createSchemaResponses({
  ...okSchemaResponse,
  ...rateLimiterMiddlewareSchemaResponse,
  ...authedMiddlewareSchemaResponse,
  ...internalErrorSchemaResponse,
});

export type ReminderResponses = InferResponses<typeof reminderSchemaResponses>;

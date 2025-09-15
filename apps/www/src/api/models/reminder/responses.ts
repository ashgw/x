import { z } from "zod";
import type { InferResponses } from "~/@ashgw/ts-rest";
import { createSchemaResponses } from "~/@ashgw/ts-rest";
import {
  authedMiddlewareSchemaResponse,
  internalErrorSchemaResponse,
  rateLimiterMiddlewareSchemaResponse,
} from "~/api/models/shared/responses";
import { reminderMessageSchemaRo } from "./ros";

export const reminderSchemaResponses = createSchemaResponses({
  200: z.object({
    created: z.array(reminderMessageSchemaRo),
  }),
  ...rateLimiterMiddlewareSchemaResponse,
  ...authedMiddlewareSchemaResponse,
  ...internalErrorSchemaResponse,
});

export type ReminderResponses = InferResponses<typeof reminderSchemaResponses>;

export type ReminderMessageRo = z.infer<typeof reminderMessageSchemaRo>;

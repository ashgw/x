import { z } from "zod";
import type { InferResponses } from "ts-rest-kit";
import { createSchemaResponses } from "ts-rest-kit";
import {
  authedMiddlewareSchemaResponse,
  internalErrorSchemaResponse,
  rateLimiterMiddlewareSchemaResponse,
} from "~/api/models/shared/responses";
import { reminderMessageCreatedSchemaRo } from "./ros";

export const reminderSchemaResponses = createSchemaResponses({
  201: z.object({
    created: z.array(reminderMessageCreatedSchemaRo),
  }),
  ...rateLimiterMiddlewareSchemaResponse,
  ...authedMiddlewareSchemaResponse,
  ...internalErrorSchemaResponse,
});

export type ReminderResponses = InferResponses<typeof reminderSchemaResponses>;

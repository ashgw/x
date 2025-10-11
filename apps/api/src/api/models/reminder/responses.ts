import { z } from "zod";
import type { InferResponses } from "ts-rest-kit/core";
import { createSchemaResponses } from "ts-rest-kit/core";
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

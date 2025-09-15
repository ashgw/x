import { z } from "zod";
import type { InferResponses } from "~/@ashgw/ts-rest";
import { createSchemaResponses } from "~/@ashgw/ts-rest";
import {
  authedMiddlewareSchemaResponse,
  internalErrorSchemaResponse,
  rateLimiterMiddlewareSchemaResponse,
} from "~/api/models/shared/responses";

export const reminderSchemaResponses = createSchemaResponses({
  200: z.object({
    created: z.array(
      z.object({
        kind: z.enum(["message", "schedule"]),
        id: z.string(),
        at: z.string().optional(),
      }),
    ),
  }),
  ...rateLimiterMiddlewareSchemaResponse,
  ...authedMiddlewareSchemaResponse,
  ...internalErrorSchemaResponse,
});

export type ReminderResponses = InferResponses<typeof reminderSchemaResponses>;

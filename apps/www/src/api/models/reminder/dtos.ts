import { z } from "zod";
import { notifyBodySchemaDto } from "../notify";

// need to require timezone in ISO to avoid accidental UTC mistakes
const isoDateTimeSchema = z
  .string()
  .datetime({ offset: true })
  .describe("e.g. '2025-01-01T00:00:00+00:00'");

export const reminderPayloadSchemaDto = z.object({
  notification: notifyBodySchemaDto,
});

const scheduleAtSchema = reminderPayloadSchemaDto.extend({
  kind: z.literal("at"),
  at: isoDateTimeSchema,
});

const scheduleCronSchema = reminderPayloadSchemaDto.extend({
  kind: z.literal("cron"),
  cron: z.object({
    timezone: z.string().min(1).max(128).describe("e.g. 'America/New_York'"),
    expression: z.string().min(1).max(16).describe("e.g. '0 0 * * *'"),
  }),
});

const scheduleMultiAtSchema = z.object({
  kind: z.literal("multiAt").describe("At multiple specific date and times"),
  at: z.array(isoDateTimeSchema).min(1).max(10),
  notifications: z.array(notifyBodySchemaDto).min(1),
});

export const createReminderBodySchemaDto = z.object({
  schedule: z.discriminatedUnion("kind", [
    scheduleAtSchema,
    scheduleCronSchema,
    scheduleMultiAtSchema,
  ]),
});

export type CreateReminderBodyDto = z.infer<typeof createReminderBodySchemaDto>;

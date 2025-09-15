import { z } from "zod";
import { notifyBodySchemaDto } from "../notify";
import { authedMiddlewareHeaderSchemaDto } from "../shared";

// need to require timezone in ISO to avoid accidental UTC mistakes
const isoDateTimeSchema = z
  .string()
  .datetime({ offset: true })
  .describe("e.g. '2025-01-01T00:00:00+00:00'");

const scheduleAtSchema = z.object({
  kind: z.literal("at").describe("At a specific date and time"),
  at: isoDateTimeSchema,
  notification: notifyBodySchemaDto,
});

const scheduleCronSchema = z.object({
  kind: z.literal("cron").describe("At a specific date and time"),
  cron: z.object({
    timezone: z.string().min(1).max(128).describe("e.g. 'America/New_York'"),
    expression: z
      .string()
      .min(1)
      .max(16)
      .describe("the 5 or 6 part POSIX cron expression, e.g. '0 0 * * *'"),
  }),
  notification: notifyBodySchemaDto,
});

const scheduleMultiAtSchema = z.object({
  kind: z.literal("multiAt").describe("At multiple specific dates and times"),
  notifications: z
    .array(
      z.object({
        at: isoDateTimeSchema,
        notification: notifyBodySchemaDto,
      }),
    )
    .describe(
      "Notifications to send at each date and time, sequentially, at least one notification is required",
    ),
});

export const reminderBodySchemaDto = z
  .object({
    schedule: z.discriminatedUnion("kind", [
      scheduleAtSchema,
      scheduleCronSchema,
      scheduleMultiAtSchema,
    ]),
  })
  .describe("The reminder to create.");

export const reminderHeadersSchemaDto = authedMiddlewareHeaderSchemaDto;

export type ReminderBodyDto = z.infer<typeof reminderBodySchemaDto>;

export type ReminderHeadersDto = z.infer<typeof reminderHeadersSchemaDto>;

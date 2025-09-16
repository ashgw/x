import { z } from "zod";
import { notifyBodySchemaDto } from "../notify";
import { authedMiddlewareHeaderSchemaDto } from "../shared";
import { isoDateTimeSchema } from "./shared";
import { NotificationType } from "@ashgw/email";

const reminderNotificationSchema = notifyBodySchemaDto
  .omit({
    to: true,
    subject: true,
  })
  .extend({
    type: z
      .literal(NotificationType.REMINDER)
      .default(NotificationType.REMINDER),
  });

const withNotification = <T extends z.ZodRawShape>(shape: T) =>
  z.object({
    ...shape,
    notification: reminderNotificationSchema,
  });

const scheduleAtSchema = withNotification({
  kind: z.literal("at").describe("At a specific date and time"),
  at: isoDateTimeSchema,
});

export const scheduleDelaySchema = withNotification({
  kind: z.literal("delay").describe("Delay for a specific duration"),
  delay: z.discriminatedUnion("unit", [
    z.object({
      unit: z.literal("seconds"),
      value: z.bigint().positive().describe("The number of seconds to delay"),
    }),
    z.object({
      unit: z.literal("minutes"),
      value: z.bigint().positive().describe("The number of minutes to delay"),
    }),
    z.object({
      unit: z.literal("hours"),
      value: z.bigint().positive().describe("The number of hours to delay"),
    }),
    z.object({
      unit: z.literal("days"),
      value: z.bigint().positive().describe("The number of days to delay"),
    }),
  ]),
});

const scheduleCronSchema = withNotification({
  kind: z.literal("cron").describe("At a specific date and time"),
  cron: z.object({
    timezone: z.string().min(1).max(128).describe("e.g. 'America/New_York'"),
    expression: z
      .string()
      .min(1)
      .max(16)
      .describe("the 5 or 6 part POSIX cron expression, e.g. '0 0 * * *'"),
  }),
});

const scheduleMultiAtSchema = z.object({
  kind: z.literal("multiAt").describe("At multiple specific dates and times"),
  notifications: z
    .array(
      z.object({
        at: isoDateTimeSchema,
        notification: reminderNotificationSchema,
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
      scheduleDelaySchema,
      scheduleCronSchema,
      scheduleMultiAtSchema,
    ]),
  })
  .describe("The reminder to create.");

export const reminderHeadersSchemaDto = authedMiddlewareHeaderSchemaDto.extend(
  {},
);

export type ReminderBodyDto = z.infer<typeof reminderBodySchemaDto>;
export type ReminderHeadersDto = z.infer<typeof reminderHeadersSchemaDto>;

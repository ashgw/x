import { z } from "zod";
import { notifyBodySchemaDto } from "../notify";

// need to require timezone in ISO to avoid accidental UTC mistakes
const isoDateTimeSchema = z.string().datetime({ offset: true });

export const reminderPayloadSchemaDto = z.object({
  notification: notifyBodySchemaDto,
});

const scheduleAtSchema = reminderPayloadSchemaDto.extend({
  kind: z.literal("at"),
  at: isoDateTimeSchema,
});

const scheduleCronSchema = reminderPayloadSchemaDto.extend({
  kind: z.literal("cron"),
  // allow CRON_TZ=Zone at the start if you want local time
  cron: z.string().min(1).max(128),
});

const scheduleMultiAtSchema = z.object({
  kind: z.literal("multiAt"),
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

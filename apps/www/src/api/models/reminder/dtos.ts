import { z } from "zod";
import { notifyBodySchemaDto } from "../notify";

// need to require timezone in ISO to avoid accidental UTC mistakes
const isoDateTime = z.string().datetime({ offset: true });

export const reminderPayloadSchemaDto = z.object({
  notification: notifyBodySchemaDto,
});

const scheduleAtSchema = z.object({
  kind: z.literal("at"),
  at: isoDateTime,
});

const scheduleMultiAtSchema = z.object({
  kind: z.literal("multiAt"),
  at: z.array(isoDateTime).min(1).max(10),
  notifications: z.array(notifyBodySchemaDto).min(1),
});

const scheduleCronSchema = z.object({
  kind: z.literal("cron"),
  // allow CRON_TZ=Zone at the start if you want local time
  cron: z.string().min(1).max(255),
});

export const reminderCreateSchemaDto = z.object({
  payload: reminderPayloadSchemaDto,
  schedule: z.discriminatedUnion("kind", [
    scheduleAtSchema,
    scheduleMultiAtSchema,
    scheduleCronSchema,
  ]),
});

export type ReminderCreateDto = z.infer<typeof reminderCreateSchemaDto>;

import { z } from "zod";
import { isoDateTimeSchema } from "./shared";

export const reminderMessageSchemaRo = z
  .object({
    kind: z.literal("message"),
    id: z.string().min(1).max(255),
    at: isoDateTimeSchema.optional(),
  })
  .describe("The reminder message created successfully.");

export type ReminderMessageRo = z.infer<typeof reminderMessageSchemaRo>;

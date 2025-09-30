import { z } from "zod";
import { token } from "../shared";

export const sessionSchemaRo = z.object({
  token, // acts as the ID @unique
  createdAt: z.date(),
  updatedAt: z.date(),
  isExpired: z.boolean(),
  userAgent: z.string().min(1).max(2048).optional(),
});

export type SessionRo = z.infer<typeof sessionSchemaRo>;

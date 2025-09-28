import { z } from "zod";
import { id, token } from "../shared";

export const sessionSchemaRo = z.object({
  id,
  createdAt: z.date(),
  userId: id,
  token,
  updatedAt: z.date(),
  expiresAt: z.date(),
  userAgent: z.string().min(1).max(2048),
});

export type SessionRo = z.infer<typeof sessionSchemaRo>;

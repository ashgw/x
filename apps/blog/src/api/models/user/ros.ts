import { z } from "zod";

import { UserRoleEnum } from "./shared";

// ========== Schemas ==========
export const sessionSchemaRo = z.object({
  id: z.string(),
  expiresAt: z.date(),
});

export const userSchemaRo = z.object({
  id: z.string(),
  email: z.string().max(255).email(),
  name: z.string().min(1).max(30).nullable(),
  role: z.nativeEnum(UserRoleEnum),
  sessions: z.array(sessionSchemaRo),
});

// ========== Types ==========
export type UserRo = z.infer<typeof userSchemaRo>;
export type SessionRo = z.infer<typeof sessionSchemaRo>;

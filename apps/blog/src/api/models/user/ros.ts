import { z } from "zod";

import { UserRoleEnum } from "./shared";
import { email, id } from "../_shared";

// ========== Schemas ==========
export const sessionSchemaRo = z.object({
  id,
  expiresAt: z.date(),
  createdAt: z.date(),
});

export const userSchemaRo = z.object({
  id,
  email,
  createdAt: z.date(),
  name: z.string().min(1).max(30).nullable(),
  role: z.nativeEnum(UserRoleEnum),
  sessions: z.array(sessionSchemaRo),
});

// ========== Types ==========
export type UserRo = z.infer<typeof userSchemaRo>;
export type SessionRo = z.infer<typeof sessionSchemaRo>;

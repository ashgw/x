import { z } from "zod";

import { UserRoleEnum } from "./shared";
import { email, id } from "../shared";

export const userSchemaRo = z.object({
  id,
  email,
  createdAt: z.date(),
  updatedAt: z.date(),
  emailVerified: z.boolean().default(false),
  name: z.string().min(1).max(30).nullable(),
  image: z.string().min(1).max(2024).optional(),
  role: z.nativeEnum(UserRoleEnum),
});

// ========== Types ==========
export type UserRo = z.infer<typeof userSchemaRo>;

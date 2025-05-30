import { z } from "zod";

// ========== Schemas ==========
export const userLoginSchemaDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const userRegisterSchemaDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).optional(),
});

// ========== Types ==========
export type UserLoginDto = z.infer<typeof userLoginSchemaDto>;
export type UserRegisterDto = z.infer<typeof userRegisterSchemaDto>;

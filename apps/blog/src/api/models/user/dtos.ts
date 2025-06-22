import { z } from "zod";

// ========== Schemas ==========
export const userLoginSchemaDto = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(255),
});

export const userRegisterSchemaDto = userLoginSchemaDto.extend({
  name: z.string().min(2).max(30),
});

// ========== Types ==========
export type UserLoginDto = z.infer<typeof userLoginSchemaDto>;
export type UserRegisterDto = z.infer<typeof userRegisterSchemaDto>;

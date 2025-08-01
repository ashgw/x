import { z } from "zod";

const passwordSchema = z.string().min(8).max(255);

// ========== Schemas ==========
export const userLoginSchemaDto = z.object({
  email: z.string().email().max(255),
  password: passwordSchema,
});

export const userRegisterSchemaDto = userLoginSchemaDto.extend({
  name: z.string().min(2).max(30),
});

export const userChangePasswordSchemaDto = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});

export const userTerminateAllActiveSessionsSchemaDto = z.object({
  userId: z.string().min(1),
});

// ========== Types ==========
export type UserLoginDto = z.infer<typeof userLoginSchemaDto>;
export type UserRegisterDto = z.infer<typeof userRegisterSchemaDto>;
export type UserChangePasswordDto = z.infer<typeof userChangePasswordSchemaDto>;
export type UserTerminateAllActiveSessionsDto = z.infer<
  typeof userTerminateAllActiveSessionsSchemaDto
>;

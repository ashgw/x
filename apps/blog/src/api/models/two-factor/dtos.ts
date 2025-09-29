import { z } from "zod";

const password = z.string().min(8).max(255);

export const twoFactorEnableDtoSchema = z.object({
  password,
  issuer: z.string().min(1).max(64).optional(),
});

export const twoFactorGetTotpUriDtoSchema = z.object({
  password,
});

export const twoFactorVerifyTotpDtoSchema = z.object({
  code: z.string().min(6).max(10),
  trustDevice: z.boolean().optional(),
});

export const twoFactorDisableDtoSchema = z.object({
  password,
});

export const twoFactorGenerateBackupCodesDtoSchema = z.object({
  password,
});

export const twoFactorVerifyBackupCodeDtoSchema = z.object({
  code: z.string().min(6).max(64),
  disableSession: z.boolean().optional(),
  trustDevice: z.boolean().optional(),
});

export type TwoFactorEnableDto = z.infer<typeof twoFactorEnableDtoSchema>;
export type TwoFactorGetTotpUriDto = z.infer<
  typeof twoFactorGetTotpUriDtoSchema
>;
export type TwoFactorVerifyTotpDto = z.infer<
  typeof twoFactorVerifyTotpDtoSchema
>;
export type TwoFactorDisableDto = z.infer<typeof twoFactorDisableDtoSchema>;
export type TwoFactorGenerateBackupCodesDto = z.infer<
  typeof twoFactorGenerateBackupCodesDtoSchema
>;
export type TwoFactorVerifyBackupCodeDto = z.infer<
  typeof twoFactorVerifyBackupCodeDtoSchema
>;

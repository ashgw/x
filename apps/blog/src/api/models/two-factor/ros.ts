import { z } from "zod";

export const twoFactorEnableRoSchema = z.object({
  totpURI: z.string().min(1).max(255),
  backupCodes: z.array(z.string().min(1).max(255)),
});

export const twoFactorGetTotpUriRoSchema = z.object({
  totpURI: z.string().min(1).max(255),
});
export const twoFactorGenerateBackupCodesRoSchema = z.object({
  backupCodes: z.array(z.string().min(1).max(255)),
});

export type TwoFactorEnableRo = z.infer<typeof twoFactorEnableRoSchema>;

export type TwoFactorGetTotpUriRo = z.infer<typeof twoFactorGetTotpUriRoSchema>;

export type TwoFactorGenerateBackupCodesRo = z.infer<
  typeof twoFactorGenerateBackupCodesRoSchema
>;

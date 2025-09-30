import { z } from "zod";

const totpURI = z.string().min(1).max(512);

export const twoFactorEnableRoSchema = z.object({
  totpURI,
  backupCodes: z.array(z.string().min(1).max(255)),
});

export const twoFactorGetTotpUriRoSchema = z.object({
  totpURI,
});
export const twoFactorGenerateBackupCodesRoSchema = z.object({
  backupCodes: z.array(z.string().min(1).max(255)),
});

export type TwoFactorEnableRo = z.infer<typeof twoFactorEnableRoSchema>;

export type TwoFactorGetTotpUriRo = z.infer<typeof twoFactorGetTotpUriRoSchema>;

export type TwoFactorGenerateBackupCodesRo = z.infer<
  typeof twoFactorGenerateBackupCodesRoSchema
>;

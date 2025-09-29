"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "@ashgw/design/motion";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  SurfaceCard,
  toast,
  Checkbox,
} from "@ashgw/design/ui";

import {
  twoFactorEnableDtoSchema,
  twoFactorGetTotpUriDtoSchema,
  twoFactorVerifyTotpDtoSchema,
  twoFactorDisableDtoSchema,
  twoFactorGenerateBackupCodesDtoSchema,
  twoFactorVerifyBackupCodeDtoSchema,
} from "~/api/models";

import type {
  TwoFactorEnableDto,
  TwoFactorGetTotpUriDto,
  TwoFactorVerifyTotpDto,
  TwoFactorDisableDto,
  TwoFactorGenerateBackupCodesDto,
  TwoFactorVerifyBackupCodeDto,
} from "~/api/models";

import { trpcClientSide } from "~/trpc/callers/client";

// ---------- utils ----------
function parseTotpSecret(totpURI: string): string | null {
  try {
    const qs = totpURI.split("?")[1];
    if (!qs) return null;
    const params = new URLSearchParams(qs);
    return params.get("secret");
  } catch {
    return null;
  }
}

function CopyableRow({ value }: { value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Input readOnly value={value} className="font-mono" />
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          void navigator.clipboard.writeText(value);
          toast.success("Copied");
        }}
      >
        Copy
      </Button>
    </div>
  );
}

// ---------- Enable (returns secret + backup codes) ----------
export function TwoFactorEnableCard({ issuer }: { issuer?: string }) {
  const form = useForm<TwoFactorEnableDto>({
    resolver: zodResolver(twoFactorEnableDtoSchema),
    defaultValues: { password: "", issuer },
    mode: "onChange",
  });

  const [secret, setSecret] = React.useState<string | null>(null);
  const [backupCodes, setBackupCodes] = React.useState<string[] | null>(null);

  const enable = trpcClientSide.user.enableTwoFactor.useMutation({
    onSuccess: (data) => {
      const s = parseTotpSecret(data.totpURI);
      setSecret(s);
      setBackupCodes(data.backupCodes);
      toast.success("Two‑factor enabled");
      form.reset({ password: "", issuer: form.getValues("issuer") });
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <SurfaceCard className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="mb-2 text-xl font-semibold">Enable 2FA (TOTP)</h2>
        <p className="text-dim-300 mb-6 text-sm">
          We won’t render a QR. You’ll see the raw secret. Add it to any
          authenticator or keep it offline.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => enable.mutate(values))}
            className="space-y-4"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issuer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuer (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your App / Company" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" loading={enable.isPending}>
                {enable.isPending ? "Enabling…" : "Enable 2FA"}
              </Button>
            </div>
          </form>
        </Form>

        {secret && (
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold">Your TOTP Secret</h3>
            <CopyableRow value={secret} />
            <p className="text-dim-300 text-xs">
              Store this somewhere safe. Anyone with this can generate valid
              codes.
            </p>
          </div>
        )}

        {backupCodes && backupCodes.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold">Backup Codes</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {backupCodes.map((c) => (
                <Input key={c} readOnly value={c} className="font-mono" />
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void navigator.clipboard.writeText(backupCodes.join("\n"));
                  toast.success("Backup codes copied");
                }}
              >
                Copy all
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const blob = new Blob([backupCodes.join("\n")], {
                    type: "text/plain",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "backup-codes.txt";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Download .txt
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </SurfaceCard>
  );
}

// ---------- Reveal Secret (for already-enabled) ----------
export function TwoFactorRevealSecretCard() {
  const form = useForm<TwoFactorGetTotpUriDto>({
    resolver: zodResolver(twoFactorGetTotpUriDtoSchema),
    defaultValues: { password: "" },
    mode: "onChange",
  });
  const [secret, setSecret] = React.useState<string | null>(null);

  const query = trpcClientSide.user.getTwoFactorTotpUri.useQuery(
    form.getValues(),
    {
      enabled: false,
    },
  );

  const run = async () => {
    const { password } = form.getValues();
    if (!password)
      return form.setError("password", { message: "Password is required" });
    const res = await query.refetch();
    if (res.data) {
      setSecret(parseTotpSecret(res.data.totpURI));
      toast.success("Secret revealed");
      form.reset({ password: "" });
    } else if (res.error) {
      toast.error(res.error.message);
    }
  };

  return (
    <SurfaceCard className="w-full">
      <h2 className="mb-2 text-xl font-semibold">Reveal TOTP Secret</h2>
      <p className="text-dim-300 mb-6 text-sm">
        If 2FA is already enabled, re-enter your password to view the secret
        again.
      </p>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void run();
          }}
          className="space-y-4"
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">Reveal</Button>
          </div>
        </form>
      </Form>
      {secret && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold">Secret</h3>
          <CopyableRow value={secret} />
        </div>
      )}
    </SurfaceCard>
  );
}

// ---------- Verify TOTP code ----------
export function TwoFactorVerifyTotpCard() {
  const form = useForm<TwoFactorVerifyTotpDto>({
    resolver: zodResolver(twoFactorVerifyTotpDtoSchema),
    defaultValues: { code: "", trustDevice: false },
    mode: "onChange",
  });

  const verify = trpcClientSide.user.verifyTwoFactorTotp.useMutation({
    onSuccess: () => {
      toast.success("TOTP verified");
      form.reset({ code: "", trustDevice: false });
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <SurfaceCard className="w-full">
      <h2 className="mb-2 text-xl font-semibold">Verify TOTP</h2>
      <p className="text-dim-300 mb-6 text-sm">
        Enter a current code from your authenticator. Optionally trust this
        device.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => verify.mutate(v))}
          className="space-y-4"
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>6–10 digit code</FormLabel>
                <FormControl>
                  <Input placeholder="123456" inputMode="numeric" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trustDevice"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={(v) => field.onChange(!!v)}
                  />
                  <FormLabel>Trust this device</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" loading={verify.isPending}>
              {verify.isPending ? "Verifying…" : "Verify"}
            </Button>
          </div>
        </form>
      </Form>
    </SurfaceCard>
  );
}

// ---------- Backup codes (generate + verify) ----------
export function TwoFactorBackupCodesCard() {
  const genForm = useForm<TwoFactorGenerateBackupCodesDto>({
    resolver: zodResolver(twoFactorGenerateBackupCodesDtoSchema),
    defaultValues: { password: "" },
    mode: "onChange",
  });
  const [codes, setCodes] = React.useState<string[] | null>(null);

  const generate = trpcClientSide.user.generateTwoFactorBackupCodes.useMutation(
    {
      onSuccess: (data) => {
        setCodes(data.backupCodes);
        toast.success("New backup codes generated");
        genForm.reset({ password: "" });
      },
      onError: (e) => toast.error(e.message),
    },
  );

  const verifyForm = useForm<TwoFactorVerifyBackupCodeDto>({
    resolver: zodResolver(twoFactorVerifyBackupCodeDtoSchema),
    defaultValues: { code: "", trustDevice: false, disableSession: false },
    mode: "onChange",
  });
  const verify = trpcClientSide.user.verifyTwoFactorBackupCode.useMutation({
    onSuccess: () => {
      toast.success("Backup code accepted");
      verifyForm.reset({ code: "", trustDevice: false, disableSession: false });
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <SurfaceCard className="w-full">
      <h2 className="mb-2 text-xl font-semibold">Backup Codes</h2>
      <p className="text-dim-300 mb-6 text-sm">
        Generate one‑time codes you can use if you lose access to your
        authenticator.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-3 font-semibold">Generate</h3>
          <Form {...genForm}>
            <form
              onSubmit={genForm.handleSubmit((v) => generate.mutate(v))}
              className="space-y-4"
              autoComplete="off"
            >
              <FormField
                control={genForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" loading={generate.isPending}>
                  {generate.isPending ? "Generating…" : "Generate"}
                </Button>
              </div>
            </form>
          </Form>

          {codes && codes.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {codes.map((c) => (
                  <Input key={c} readOnly value={c} className="font-mono" />
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    void navigator.clipboard.writeText(codes.join("\n"));
                    toast.success("Backup codes copied");
                  }}
                >
                  Copy all
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const blob = new Blob([codes.join("\n")], {
                      type: "text/plain",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "backup-codes.txt";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Download .txt
                </Button>
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Verify backup code</h3>
          <Form {...verifyForm}>
            <form
              onSubmit={verifyForm.handleSubmit((v) => verify.mutate(v))}
              className="space-y-4"
              autoComplete="off"
            >
              <FormField
                control={verifyForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="xxxx-xxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={verifyForm.control}
                name="trustDevice"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={(v) => field.onChange(!!v)}
                      />
                      <FormLabel>Trust this device</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={verifyForm.control}
                name="disableSession"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={(v) => field.onChange(!!v)}
                      />
                      <FormLabel>Disable current session after use</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" loading={verify.isPending}>
                  {verify.isPending ? "Verifying…" : "Verify backup code"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </SurfaceCard>
  );
}

// ---------- Disable 2FA ----------
export function TwoFactorDisableCard() {
  const form = useForm<TwoFactorDisableDto>({
    resolver: zodResolver(twoFactorDisableDtoSchema),
    defaultValues: { password: "" },
    mode: "onChange",
  });

  const disable = trpcClientSide.user.disableTwoFactor.useMutation({
    onSuccess: () => {
      toast.success("Two‑factor disabled");
      form.reset({ password: "" });
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <SurfaceCard className="w-full">
      <h2 className="mb-2 text-xl font-semibold">Disable 2FA</h2>
      <p className="text-dim-300 mb-6 text-sm">
        Requires your password. This removes TOTP and invalidates existing
        backup codes.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => disable.mutate(v))}
          className="space-y-4"
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              variant="destructive"
              loading={disable.isPending}
            >
              {disable.isPending ? "Disabling…" : "Disable 2FA"}
            </Button>
          </div>
        </form>
      </Form>
    </SurfaceCard>
  );
}

// ---------- Aggregated section (drop‑in) ----------
export function TwoFactorSection() {
  return (
    <div className="layout mx-auto max-w-2xl space-y-8">
      <TwoFactorEnableCard />
      <TwoFactorRevealSecretCard />
      <TwoFactorVerifyTotpCard />
      <TwoFactorBackupCodesCard />
      <TwoFactorDisableCard />
    </div>
  );
}

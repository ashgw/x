"use client";

import { useRouter } from "next/navigation";
import { toast } from "@ashgw/design/ui";

import { logger } from "@ashgw/logger";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Loading,
} from "@ashgw/design/ui";

import { useAuth } from "~/app/hooks/auth";
import { trpcClientSide } from "~/trpc/callers/client";
import { ChangePasswordForm } from "./components/ChangePasswordForm";
import { SessionsList } from "./components/SessionsList";
import { UserInfo } from "./components/UserInfo";

import {
  TwoFactorEnableCard,
  TwoFactorRevealSecretCard,
  TwoFactorVerifyTotpCard,
  TwoFactorBackupCodesCard,
  TwoFactorDisableCard,
} from "./components/TwoFactorBlock";

export function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const utils = trpcClientSide.useUtils();

  if (!isLoading && !user) {
    router.push("/login");
    return null;
  }

  if (isLoading || !user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loading />
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      await utils.user.me.invalidate();
      toast.success("Successfully logged out");
    } catch (error) {
      logger.error("Logout failed", { error });
      toast.error("Failed to logout, please try again later");
    }
  };

  return (
    <div className="layout mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Account Settings</h1>
          <div className="flex items-center gap-2">
            <Badge appearance="outline" className="text-sm">
              {user.role}
            </Badge>
            <Badge appearance="soft" className="text-sm">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </Badge>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Profile Info */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <UserInfo user={user} />
              </CardContent>
            </Card>
          </div>

          {/* Password */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent>
                <ChangePasswordForm />
              </CardContent>
            </Card>
          </div>

          {/* Sessions */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Sessions</CardTitle>
                <CardDescription>Manage your device sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <SessionsList currentSessionToken={user.session.token} />
              </CardContent>
            </Card>
          </div>

          {/* Two-Factor Authentication */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Enable TOTP, reveal your secret, verify codes, manage backup
                  codes, or disable.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Enable first (shows raw secret + backup codes) */}
                <div className="mb-6">
                  {/* Pass an issuer if you want it embedded in otpauth URIs */}
                  <TwoFactorEnableCard />
                </div>

                {/* Management grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <TwoFactorRevealSecretCard />
                  <TwoFactorVerifyTotpCard />
                  <div className="md:col-span-2">
                    <TwoFactorBackupCodesCard />
                  </div>
                  <TwoFactorDisableCard />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Logout */}
        <div className="flex justify-end pt-4">
          <Button
            variant="destructive:outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

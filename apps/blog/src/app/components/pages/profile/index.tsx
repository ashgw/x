"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { logger, monitor } from "@ashgw/observability";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LoadingPoints as Loading,
} from "@ashgw/ui";

import { useAuth } from "~/app/hooks/auth";
import { trpcClientSide } from "~/trpc/client";
import { ChangePasswordForm } from "./components/ChangePasswordForm";
import { SessionsList } from "./components/SessionsList";
import { UserInfo } from "./components/UserInfo";

export function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const utils = trpcClientSide.useUtils();

  // If not logged in, redirect to login
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  const handleLogout = async () => {
    try {
      await logout();
      await utils.user.me.invalidate();
      toast.success("Successfully logged out");
      router.push("/login");
    } catch (error) {
      logger.error("Logout failed", { error });
      monitor.next.captureException({ error });
      toast.error("Failed to logout");
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              View and manage your account settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserInfo user={user} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>
              Manage your active sessions across devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SessionsList />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="squared:destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { logger, monitor } from "@ashgw/observability";
import {
  Badge,
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const utils = trpcClientSide.useUtils();

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
      toast.error("Failed to logout, please try again later");
    }
  };

  if (isLoading || !user) {
    return (
      <motion.div
        className="flex h-[50vh] items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Loading />
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header Section */}
          <motion.div variants={cardVariants} className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Account Settings</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {user.role}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </Badge>
            </div>
          </motion.div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Profile Info Card */}
            <motion.div variants={cardVariants}>
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center gap-2">
                  <div>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Your account information</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <UserInfo user={user} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Password Change Card */}
            <motion.div variants={cardVariants}>
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center gap-2">
                  <div>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChangePasswordForm />
                </CardContent>
              </Card>
            </motion.div>

            {/* Sessions Card - Full Width */}
            <motion.div variants={cardVariants} className="md:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <div>
                    <CardTitle>Sessions</CardTitle>
                    <CardDescription>
                      Manage your device sessions
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <SessionsList sessions={user.sessions} />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Logout Button */}
          <motion.div
            variants={cardVariants}
            className="flex justify-end pt-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              Logout
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

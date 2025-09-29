// components/SessionsList.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "@ashgw/design/motion";
import { Shield, XCircle } from "@ashgw/design/icons";
import { toast } from "@ashgw/design/ui";
import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  Loading,
  TableRow,
} from "@ashgw/design/ui";

import { trpcClientSide } from "~/trpc/callers/client";

const tableVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

interface SessionsListProps {
  currentSessionToken: string;
}

export function SessionsList({ currentSessionToken }: SessionsListProps) {
  const [loadingSessionIds, setLoadingSessionIds] = useState<Set<string>>(
    new Set(),
  );
  const [terminatingAllSessions, setTerminatingAllSessions] = useState(false);

  const router = useRouter();
  const utils = trpcClientSide.useUtils();

  // fetch sessions for table
  const { data: sessions = [], isLoading } =
    trpcClientSide.user.listAllSessions.useQuery();

  // logout mutation to clear cookie server-side
  const logoutMutation = trpcClientSide.user.logout.useMutation();

  const hardLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      await Promise.allSettled([
        utils.user.me.invalidate(),
        utils.user.listAllSessions.invalidate(),
      ]);
      router.replace("/login");
    }
  };

  const setSessionLoading = (sessionId: string, state: boolean) => {
    setLoadingSessionIds((prev) => {
      const next = new Set(prev);
      if (state) next.add(sessionId);
      else next.delete(sessionId);
      return next;
    });
  };

  const terminateAllSessionsMutation =
    trpcClientSide.user.terminateAllActiveSessions.useMutation({
      onMutate: () => setTerminatingAllSessions(true),
      onSuccess: async () => {
        toast.success("All sessions terminated");
        // includes current session, force immediate logout
        await hardLogout();
      },
      onError: (error) => {
        setTerminatingAllSessions(false);
        toast.error(error.message);
      },
      onSettled: () => {
        setTerminatingAllSessions(false);
      },
    });

  const terminateSpecificSessionMutation =
    trpcClientSide.user.terminateSpecificSession.useMutation({
      onMutate: ({ token }) => setSessionLoading(token, true),
      onSuccess: async (_data, { token }) => {
        toast.success("Session terminated");
        if (currentSessionToken && token === currentSessionToken) {
          // killed the active device session
          await hardLogout();
          return;
        }
        await utils.user.listAllSessions.invalidate();
        router.refresh();
      },
      onError: (error, { token }) => {
        setSessionLoading(token, false);
        toast.error(error.message);
      },
      onSettled: (_data, _err, vars) => {
        if (vars.token) setSessionLoading(vars.token, false);
      },
    });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loading />
      </div>
    );
  }

  if (!sessions.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-muted-foreground flex flex-col items-center justify-center py-8"
      >
        <Shield className="mb-2 h-12 w-12 opacity-50" />
        <p>No active sessions found.</p>
      </motion.div>
    );
  }

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <motion.div
      className="space-y-6"
      variants={tableVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[200px]">Created At</TableHead>
              <TableHead className="w-[200px]">Expires At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {sessions.map((session) => {
                const isRowLoading =
                  loadingSessionIds.has(session.token) ||
                  terminatingAllSessions;
                const isCurrent = currentSessionToken === session.token;

                return (
                  <motion.tr
                    key={session.token}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="group hover:bg-accent/55"
                    aria-current={isCurrent ? "true" : "false"}
                  >
                    <TableCell className="font-medium">
                      {formatDate(session.createdAt)}
                    </TableCell>
                    <TableCell>{formatDate(session.updatedAt)}</TableCell>
                    <TableCell>
                      <Badge
                        size={"sm"}
                        appearance={"outline"}
                        tone={session.isExpired ? "destructive" : "success"}
                      >
                        {session.isExpired
                          ? "Expired"
                          : isCurrent
                            ? "Active • This device"
                            : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        onClick={() =>
                          terminateSpecificSessionMutation.mutate({
                            token: session.token,
                          })
                        }
                        disabled={isRowLoading}
                        className="opacity:70 transition-opacity group-hover:opacity-100"
                        title={
                          isCurrent
                            ? "Terminate current device session"
                            : "Terminate session"
                        }
                      >
                        {isRowLoading ? (
                          <Loading />
                        ) : (
                          <XCircle className="mr-2 h-4 w-4" />
                        )}
                        Terminate
                      </Button>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {sessions.length} active{" "}
          {sessions.length === 1 ? "session" : "sessions"}
        </p>
        <Button
          variant="destructive"
          onClick={() => terminateAllSessionsMutation.mutate()}
          disabled={terminatingAllSessions}
          className="relative"
        >
          {terminatingAllSessions ? (
            <Loading />
          ) : (
            <XCircle className="mr-2 h-4 w-4" />
          )}
          Terminate All Sessions
        </Button>
      </div>
    </motion.div>
  );
}

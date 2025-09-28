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
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
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

export function SessionsList() {
  const [loadingSessionIds, setLoadingSessionIds] = useState<Set<string>>(
    new Set(),
  );
  const [terminatingAllSessions, setTerminatingAllSessions] = useState(false);

  const router = useRouter();
  // fetch sessions
  const { data: sessions = [], isLoading } =
    trpcClientSide.user.listAllSessions.useQuery();

  const utils = trpcClientSide.useUtils();

  const setSessionLoading = (sessionId: string, isLoading: boolean) => {
    setLoadingSessionIds((prev) => {
      const next = new Set(prev);
      if (isLoading) next.add(sessionId);
      else next.delete(sessionId);
      return next;
    });
  };

  const terminateAllSessionsMutation =
    trpcClientSide.user.terminateAllActiveSessions.useMutation({
      onMutate: () => setTerminatingAllSessions(true),
      onSuccess: () => {
        setTimeout(() => {
          setTerminatingAllSessions(false);
          void utils.user.listAllSessions.invalidate();
          toast.success("All sessions terminated successfully");
        }, 500);
        router.refresh();
      },
      onError: (error) => {
        setTerminatingAllSessions(false);
        toast.error(error.message);
      },
    });

  const terminateSpecificSessionMutation =
    trpcClientSide.user.terminateSpecificSession.useMutation({
      onMutate: ({ token }) => setSessionLoading(token, true),
      onSuccess: (_, { token }) => {
        setTimeout(() => {
          setSessionLoading(token, false);
          void utils.user.listAllSessions.invalidate();
          toast.success("Session terminated successfully");
        }, 500);
        router.refresh();
      },
      onError: (error, { token }) => {
        setSessionLoading(token, false);
        toast.error(error.message);
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
                const isLoading =
                  loadingSessionIds.has(session.token) ||
                  terminatingAllSessions;

                return (
                  <motion.tr
                    key={session.token}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="group hover:bg-accent/55"
                  >
                    <TableCell className="font-medium">
                      {formatDate(session.createdAt)}
                    </TableCell>
                    <TableCell>{formatDate(session.updatedAt)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={session.isExpired ? "destructive" : "success"}
                        className="rounded-sm px-2 py-0.5 text-xs font-medium"
                      >
                        {session.isExpired ? "Expired" : "Active"}
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
                        disabled={isLoading}
                        className="opacity-70 transition-opacity group-hover:opacity-100"
                      >
                        {isLoading ? (
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

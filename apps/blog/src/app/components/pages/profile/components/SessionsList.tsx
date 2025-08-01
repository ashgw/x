"use client";

import { motion } from "framer-motion";
import { Loader2, Shield, XCircle } from "lucide-react";
import { toast } from "sonner";

import { logger, monitor } from "@ashgw/observability";
import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ashgw/ui";

import type { SessionRo } from "~/api/models";
import { trpcClientSide } from "~/trpc/client";

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export function SessionsList(props: { sessions: SessionRo[] }) {
  const terminateAllSessionsMutation =
    trpcClientSide.user.terminateAllActiveSessions.useMutation({
      onSuccess: () => {
        toast.success("All sessions terminated successfully");
      },
      onError: (error) => {
        logger.error("Failed to terminate all sessions", { error });
        monitor.next.captureException({ error });
        toast.error("Failed to terminate all sessions");
      },
    });

  const terminateSpecificSessionMutation =
    trpcClientSide.user.terminateSpecificSession.useMutation({
      onSuccess: () => {
        toast.success("Session terminated successfully");
      },
      onError: (error) => {
        logger.error("Failed to terminate specific session", { error });
        monitor.next.captureException({ error });
        toast.error("Failed to terminate specific session");
      },
    });

  if (!props.sessions.length) {
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

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
            {props.sessions.map((session) => {
              const isExpired = new Date(session.expiresAt) < new Date();
              return (
                <motion.tr
                  key={session.id}
                  variants={rowVariants}
                  className="group"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                >
                  <TableCell className="font-medium">
                    {formatDate(session.createdAt)}
                  </TableCell>
                  <TableCell>{formatDate(session.expiresAt)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={isExpired ? "destructive" : "success"}
                      className="rounded-sm px-2 py-0.5 text-xs font-medium"
                    >
                      {isExpired ? "Expired" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        terminateSpecificSessionMutation.mutate({
                          sessionId: session.id,
                        })
                      }
                      disabled={terminateSpecificSessionMutation.isPending}
                      className="opacity-70 transition-opacity group-hover:opacity-100"
                    >
                      {terminateSpecificSessionMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="mr-2 h-4 w-4" />
                      )}
                      Terminate
                    </Button>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {props.sessions.length} active{" "}
          {props.sessions.length === 1 ? "session" : "sessions"}
        </p>
        <Button
          variant="destructive"
          onClick={() => terminateAllSessionsMutation.mutate()}
          disabled={terminateAllSessionsMutation.isPending}
          className="relative"
        >
          {terminateAllSessionsMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="mr-2 h-4 w-4" />
          )}
          Terminate All Sessions
        </Button>
      </div>
    </motion.div>
  );
}

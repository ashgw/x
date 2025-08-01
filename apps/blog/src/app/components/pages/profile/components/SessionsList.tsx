"use client";

import { toast } from "sonner";

import { logger, monitor } from "@ashgw/observability";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ashgw/ui";

import { trpcClientSide } from "~/trpc/client";

export function SessionsList() {
  const { data: sessions, isLoading } = trpcClientSide.user.sessions.useQuery();
  const utils = trpcClientSide.useUtils();

  const terminateSessionMutation =
    trpcClientSide.user.terminateSession.useMutation({
      onSuccess: () => {
        toast.success("Session terminated successfully");
        void utils.user.sessions.invalidate();
      },
      onError: (error: Error) => {
        logger.error("Failed to terminate session", { error });
        monitor.next.captureException({ error });
        toast.error("Failed to terminate session");
      },
    });

  const terminateAllSessionsMutation =
    trpcClientSide.user.terminateAllSessions.useMutation({
      onSuccess: () => {
        toast.success("All sessions terminated successfully");
        void utils.user.sessions.invalidate();
      },
      onError: (error: Error) => {
        logger.error("Failed to terminate all sessions", { error });
        monitor.next.captureException({ error });
        toast.error("Failed to terminate all sessions");
      },
    });

  if (isLoading) {
    return <div>Loading sessions...</div>;
  }

  if (!sessions?.length) {
    return <div>No active sessions found.</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Created At</TableHead>
            <TableHead>Expires At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>
                {new Date(session.createdAt as string).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(session.expiresAt as string).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="squared:destructive"
                  size="sm"
                  onClick={() =>
                    terminateSessionMutation.mutate({ sessionId: session.id })
                  }
                  loading={terminateSessionMutation.isPending}
                >
                  Terminate
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end">
        <Button
          variant="squared:destructive"
          onClick={() => terminateAllSessionsMutation.mutate()}
          loading={terminateAllSessionsMutation.isPending}
        >
          Terminate All Sessions
        </Button>
      </div>
    </div>
  );
}

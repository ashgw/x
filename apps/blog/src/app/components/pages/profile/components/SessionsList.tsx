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

import type { SessionRo } from "~/api/models";
import { trpcClientSide } from "~/trpc/client";

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
          {props.sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>
                {new Date(session.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(session.expiresAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    terminateSpecificSessionMutation.mutate({
                      sessionId: session.id,
                    })
                  }
                  loading={terminateSpecificSessionMutation.isPending}
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
          variant="destructive"
          onClick={() => terminateAllSessionsMutation.mutate()}
          loading={terminateAllSessionsMutation.isPending}
        >
          Terminate All Sessions
        </Button>
      </div>
    </div>
  );
}

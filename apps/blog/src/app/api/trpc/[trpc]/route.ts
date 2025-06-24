import type { NextRequest, NextResponse } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { db } from "@ashgw/db";
import { logger, monitor } from "@ashgw/observability";

import { appRouter } from "~/api/router";
import { createTRPCContext } from "~/trpc/context";
import { trpcUri } from "~/trpc/endpoint";

const handler = (req: NextRequest, res: NextResponse) =>
  fetchRequestHandler({
    endpoint: trpcUri,
    allowMethodOverride: false,
    allowBatching: true,
    onError({ error, path, input }) {
      monitor.next.captureException({
        error,
        hint: {
          extra: {
            path,
            input,
          },
        },
      });
      logger.error(`>>> tRPC Error on '${path}'`, error);
    },
    req,
    router: appRouter,
    createContext: ({ info: trpcInfo }) =>
      createTRPCContext({
        res,
        req,
        trpcInfo,
        db,
      }),
  });

export { handler as GET, handler as POST };

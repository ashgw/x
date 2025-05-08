import type { NextRequest, NextResponse } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { db } from "@ashgw/db";
import { logger, monitor } from "@ashgw/observability";

import { appRouter } from "~/api/router";
import { trpcUri } from "~/trpc/client";
import { createTRPCContext } from "~/trpc/context";

const handler = (req: NextRequest, res: NextResponse) =>
  fetchRequestHandler({
    endpoint: trpcUri,
    allowMethodOverride: false,
    allowBatching: true,
    onError(opts) {
      monitor.next.captureException({
        error: opts.error,
        hint: {
          extra: {
            path: opts.path,
            input: opts.input,
          },
        },
      });
      logger.error(opts.error);
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

import type { NextRequest, NextResponse } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { logger, sentry } from "@ashgw/observability";

import { appRouter } from "~/server/router";
import { trpcUri } from "~/trpc/client";
import { createTRPCContext } from "~/trpc/context";

const handler = (req: NextRequest, res: NextResponse) =>
  fetchRequestHandler({
    endpoint: trpcUri,
    allowMethodOverride: false,
    allowBatching: true,
    onError(opts) {
      sentry.next.captureException({
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
    createContext: ({ info: trpcRequestInfo }) =>
      createTRPCContext({
        res,
        req,
        trpcInfo: trpcRequestInfo,
      }),
  });

export { handler as GET, handler as POST };

import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { logger, sentry } from "@ashgw/observability";

import { appRouter } from "~/server/router";
import { trpcUri } from "~/trpc/client";
import { createTRPCContext } from "~/trpc/context";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: trpcUri,
    onError(opts) {
      // actually here add more contex, use the stuff from ops
      logger.error(opts.error);
      sentry.next.captureException({
        message: opts.error.message,
        error: opts.error,
        hint: {
          extra: {
            path: opts.path,
            input: opts.input,
          },
        },
      });
    },
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };

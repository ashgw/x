import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { NextRequest, NextResponse } from "next/server";

import type { PrismaClient } from "@ashgw/db";

export function createTRPCContext(opts: {
  req: NextRequest;
  res: NextResponse;
  trpcInfo: FetchCreateContextFnOptions["info"];
  db: PrismaClient;
}) {
  return {
    req: opts.req,
    res: opts.res,
    trpcInfo: opts.trpcInfo,
    db: opts.db,
  };
}

export type TrpcContext = Awaited<ReturnType<typeof createTRPCContext>>;

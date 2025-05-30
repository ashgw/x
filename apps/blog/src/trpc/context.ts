import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { NextRequest, NextResponse } from "next/server";

import type { DatabaseClient } from "@ashgw/db";

// @see https://trpc.io/docs/server/context

export function createInnerTRPCContext(opts: { db: DatabaseClient }) {
  return {
    db: opts.db,
  };
}

export function createTRPCContext(opts: {
  req: NextRequest;
  res: NextResponse;
  trpcInfo: FetchCreateContextFnOptions["info"];
  db: DatabaseClient;
}) {
  const innerContext = createInnerTRPCContext({
    db: opts.db,
  });

  return {
    ...innerContext,
    req: opts.req,
    res: opts.res,
  };
}

export type TrpcContext = Awaited<ReturnType<typeof createTRPCContext>>;

export type InnerTrpcContext = Awaited<
  ReturnType<typeof createInnerTRPCContext>
>;

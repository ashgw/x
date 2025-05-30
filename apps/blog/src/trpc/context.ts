import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { NextRequest, NextResponse } from "next/server";

import type { DatabaseClient } from "@ashgw/db";

import { AuthService } from "~/api/services";

// @see https://trpc.io/docs/server/context

export function createInnerTRPCContext(opts: { db: DatabaseClient }) {
  return {
    db: opts.db,
  };
}

export async function createTRPCContext(opts: {
  req: NextRequest;
  res: NextResponse;
  trpcInfo: FetchCreateContextFnOptions["info"];
  db: DatabaseClient;
}) {
  const innerContext = createInnerTRPCContext({
    db: opts.db,
  });
  const user = await new AuthService({ db: opts.db }).me();
  return {
    ...innerContext,
    req: opts.req,
    res: opts.res,
    user,
  };
}

export type TrpcContext = Awaited<ReturnType<typeof createTRPCContext>>;

export type InnerTrpcContext = Awaited<
  ReturnType<typeof createInnerTRPCContext>
>;

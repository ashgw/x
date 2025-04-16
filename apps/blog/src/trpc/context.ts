import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { NextRequest, NextResponse } from "next/server";

export function createTRPCContext(opts: {
  req: NextRequest;
  res: NextResponse;
  trpcInfo: FetchCreateContextFnOptions["info"];
}) {
  return {
    req: opts.req,
    res: opts.res,
    trpcInfo: opts.trpcInfo,
  };
}

export type TrpcContext = Awaited<ReturnType<typeof createTRPCContext>>;

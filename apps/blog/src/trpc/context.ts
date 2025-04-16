import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { NextRequest, NextResponse } from "next/server";

export function createTRPCContext(
  opts: FetchCreateContextFnOptions & {
    req: NextRequest;
    res: NextResponse;
  },
) {
  return {
    req: opts.req,
    res: opts.res,
    trpcInfo: opts.info,
  };
}

export type TrpcContext = Awaited<ReturnType<typeof createTRPCContext>>;

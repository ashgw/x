import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { NextRequest, NextResponse } from "next/server";

interface CreateInnerTRPCContextOptions {
  req: NextRequest;
  res: NextResponse;
}

export const createInnerTRPCContext = (opts: CreateInnerTRPCContextOptions) => {
  return {
    ...opts,
    req: opts.req,
  };
};

export function createTRPCContext(opts: {
  trpcInfo: FetchCreateContextFnOptions["info"];
  req: NextRequest;
  res: NextResponse;
}) {
  return createInnerTRPCContext({
    req: opts.req,
    res: opts.res,
  });
}

export type TrpcContext = Awaited<ReturnType<typeof createTRPCContext>>;

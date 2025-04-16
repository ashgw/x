import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";

interface CreateInnerTRPCContextOptions {
  req: NextRequest;
}

export const createInnerTRPCContext = (opts: CreateInnerTRPCContextOptions) => {
  return {
    ...opts,
    req: opts.req,
  };
};

export function createTRPCContext(opts: FetchCreateContextFnOptions) {
  return createInnerTRPCContext({
    req: opts.req,
  });
}

export type TrpcContext = Awaited<ReturnType<typeof createTRPCContext>>;

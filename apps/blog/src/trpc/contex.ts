import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export function createTRPCContext(_opts: FetchCreateContextFnOptions) {
  return {
    // Add other blog-specific context here
    // Example: prisma: new PrismaClient()
  };
}

export type TrpcContext = Awaited<ReturnType<typeof createTRPCContext>>;

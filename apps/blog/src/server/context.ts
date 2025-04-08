import type { inferAsyncReturnType } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createContext(opts: FetchCreateContextFnOptions) {
  return {
    // Add blog-specific context here
    // Example: prisma: new PrismaClient()
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

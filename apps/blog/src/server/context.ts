import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export function createContext(_opts: FetchCreateContextFnOptions) {
  return {
    // Add other blog-specific context here
    // Example: prisma: new PrismaClient()
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

import type { inferAsyncReturnType } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export function createContext(_opts: FetchCreateContextFnOptions) {
  const user = _opts.req.headers.get("username") ?? "anonymous";

  return {
    user,
    // Add other blog-specific context here
    // Example: prisma: new PrismaClient()
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

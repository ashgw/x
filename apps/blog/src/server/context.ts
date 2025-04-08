import type { inferAsyncReturnType } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

/**
 * Creates the TRPC context for a request.
 *
 * This asynchronous function returns an object that serves as a customizable context for the TRPC server. Extend the returned object with blog-specific data as needed,
 * such as a database client.
 *
 * @param opts - Options provided by the TRPC fetch adapter.
 * @returns The context object for the TRPC server.
 */
export async function createContext(opts: FetchCreateContextFnOptions) {
  return {
    // Add blog-specific context here
    // Example: prisma: new PrismaClient()
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

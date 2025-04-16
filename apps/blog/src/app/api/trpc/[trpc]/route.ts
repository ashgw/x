import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createTRPCContext } from "~/server/context";
import { appRouter } from "~/server/root";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };

import "server-only";

import { cache } from "react";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

import { createContext } from "~/server/context";
import { AppRouter } from "~/server/root";
import { makeQueryClient } from "./query-client";

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
const caller = createCallerFactory(appRouter)(createTRPCContext);
export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient,
);

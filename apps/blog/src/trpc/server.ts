import "server-only"; // DO NOT DELET THIS DAWG

import { cache } from "react";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

import type { AppRouter } from "~/server/router";
import { appRouter } from "~/server/router";
import { createCallerFactory } from "~/trpc/trpc";
import { createTRPCContext } from "./contex";
import { makeQueryClient } from "./query-client";

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.

export const getQueryClient = cache(makeQueryClient);

const caller = createCallerFactory(appRouter)(createTRPCContext);

export const { trpc: trpcServer, HydrateClient } =
  createHydrationHelpers<AppRouter>(caller, getQueryClient);

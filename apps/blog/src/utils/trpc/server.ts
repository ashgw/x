import "server-only";

import { cache } from "react";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

import type { AppRouter } from "~/server/root";
import { makeQueryClient } from "./query-client";

export const getQueryClient = cache(makeQueryClient);

const server = createCallerFactory(appRouter)(createTRPCContext);
export const { trpc, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);

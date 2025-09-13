import "server-only"; // DO NOT DELETE THIS DAWG

import type { TRPCRequestInfo } from "@trpc/server/unstable-core-do-not-import";
import type { NextRequest, NextResponse } from "next/server";
import { cache } from "react";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

import { db } from "@ashgw/db";

import type { AppRouter } from "~/api/router";
import { appRouter } from "~/api/router";
import { createCallerFactory } from "~/trpc/root";
import { createTRPCContext } from "./context";
import { makeQueryClient } from "./query-client";

const context = createTRPCContext({
  db,
  req: {} as NextRequest,
  res: {} as NextResponse,
  trpcInfo: {} as TRPCRequestInfo,
});

const serverSideCaller = createCallerFactory(appRouter)(context);

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
const getQueryClient = cache(makeQueryClient);

// use HydrateClient for server side hydration if not using the default fallbacks provided by Next.js
export const { trpc: trpcServerSide, HydrateClient } =
  createHydrationHelpers<AppRouter>(serverSideCaller, getQueryClient);

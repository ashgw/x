import "server-only"; // DO NOT DELETE THIS DAWG

import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { NextRequest, NextResponse } from "next/server";
import { cache } from "react";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

import { db } from "@ashgw/db";

import type { AppRouter } from "~/api/router";
import { appRouter } from "~/api/router";
import { createCallerFactory } from "~/trpc/trpc";
import { createTRPCContext } from "./context";
import { makeQueryClient } from "./query-client";

const caller = createCallerFactory(appRouter)(
  createTRPCContext({
    // since these are empty do not use them for anything other than server side simple fetching, don't check for them
    req: {} as NextRequest,
    res: {} as NextResponse,
    trpcInfo: {} as FetchCreateContextFnOptions["info"],
    // only the db works
    db,
  }),
);

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
const getQueryClient = cache(makeQueryClient);

// use HydrateClient for server side hydration if not using the default fallbacks provided by Next.js
export const { trpc: trpcServerSideClient, HydrateClient } =
  createHydrationHelpers<AppRouter>(caller, getQueryClient);

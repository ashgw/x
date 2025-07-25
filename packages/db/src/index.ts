// uncomment this for more strictness, if you're doing crazy db shenanigans in the forntend
// import "server-only";

import type { MaybeUndefined } from "ts-roids";
import { neonConfig, Pool as NeonPool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

import { env } from "@ashgw/env";

import { PrismaClient as FullPrismaClient } from "./generated/client";

// keep only the methods you actually call
export type DatabaseClient = Omit<
  FullPrismaClient,
  | "$connect"
  | "$disconnect"
  | "$on"
  // | "$transaction"
  | "$use"
  | "$extends"
  | "$executeRaw"
  | "$executeRawUnsafe"
  | "$queryRaw"
  | "$queryRawUnsafe"
>;

// global cache to survive hot-reloads
const globalForDb = globalThis as unknown as {
  prisma: MaybeUndefined<DatabaseClient>;
};

// Only configure Neon if we're using a Neon database
const isNeonDatabase = env.DATABASE_URL.includes("neon.tech");

if (isNeonDatabase) {
  neonConfig.webSocketConstructor = ws;
}

const db =
  globalForDb.prisma ??
  (isNeonDatabase
    ? new FullPrismaClient({
        adapter: new PrismaNeon(
          new NeonPool({
            connectionString: env.DATABASE_URL,
            max: 10,
            connectionTimeoutMillis: 15000,
          }),
        ),
        errorFormat: "pretty",
        log:
          env.NODE_ENV === "development"
            ? ["query", "info", "warn", "error"]
            : ["error"],
        transactionOptions: {
          maxWait: 10000,
          timeout: 30000,
          isolationLevel: "ReadCommitted",
        },
      })
    : (new FullPrismaClient({
        datasourceUrl: env.DATABASE_URL,
        errorFormat: "pretty",
        log:
          env.NODE_ENV === "development"
            ? ["query", "info", "warn", "error"]
            : ["error"],
        transactionOptions: {
          maxWait: 10000,
          timeout: 30000,
          isolationLevel: "ReadCommitted",
        },
      }) satisfies DatabaseClient));

// store the singleton in dev to avoid leaks when reloading
if (env.NODE_ENV === "development") {
  globalForDb.prisma = db;
}

export { db };

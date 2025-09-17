// uncomment this for more strictness, if you're doing crazy db shenanigans in the frontend
// import "server-only";

import type { PrismaClientOptions } from "@prisma/client/runtime/client";
import type { MaybeUndefined } from "ts-roids";
import { neonConfig, Pool as NeonPool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

import { env } from "@ashgw/env";

import { PrismaClient as FullPrismaClient } from "@prisma/client";

export type DatabaseClient = Omit<
  FullPrismaClient,
  // | "$transaction" //  need it for some
  | "$connect"
  | "$disconnect"
  | "$on"
  | "$use"
  | "$extends"
  | "$executeRaw"
  | "$executeRawUnsafe"
  | "$queryRaw"
  | "$queryRawUnsafe"
>;

// global cache to survive hot-reloads in dev
const globalForDb = globalThis as unknown as {
  prisma: MaybeUndefined<DatabaseClient>;
};

// Only configure Neon if we're using a Neon database
const isNeonDatabase = env.DATABASE_URL.includes("neon.tech");

if (isNeonDatabase) {
  neonConfig.webSocketConstructor = ws;
}

const errorFormat: PrismaClientOptions["errorFormat"] = "pretty";

const log: PrismaClientOptions["log"] =
  env.NODE_ENV === "development"
    ? ["query", "info", "warn", "error"]
    : ["error"];

const transactionOptions = {
  maxWait: 10000,
  timeout: 30000,
  isolationLevel: "ReadCommitted",
} as const;

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
        errorFormat,
        log,
        transactionOptions,
      })
    : (new FullPrismaClient({
        datasourceUrl: env.DATABASE_URL,
        errorFormat,
        log,
        transactionOptions,
      }) satisfies DatabaseClient));

// store the singleton in next dev to avoid leaks when reloading
if (env.NODE_ENV === "development") {
  globalForDb.prisma = db;
}

export { db };

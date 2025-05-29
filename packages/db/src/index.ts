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
  | "$transaction"
  | "$use"
  | "$extends"
  | "$executeRaw"
  | "$executeRawUnsafe"
  | "$queryRaw"
  | "$queryRawUnsafe"
>;

// global cache to survive hot-reloads
const globalForDb = globalThis as unknown as {
  pool: MaybeUndefined<NeonPool>;
  prisma: MaybeUndefined<DatabaseClient>;
};

// if you have build errors @see https://github.com/prisma/prisma/discussions/21346#discussioncomment-9292320
// for more info @see http://neon.tech/docs/guides/prisma#connect-to-neon-from-prisma
neonConfig.webSocketConstructor = ws;

/**
 * Hot-reload guard: if the cached object is not
 * an instance of the current Pool constructor
 * we drop it and create a fresh one.
 */
function isSamePool(obj: unknown): obj is NeonPool {
  return obj instanceof NeonPool;
}

const pool = isSamePool(globalForDb.pool)
  ? globalForDb.pool
  : new NeonPool({
      connectionString: env.DATABASE_URL,
      max: 10,
      connectionTimeoutMillis: 15000,
    });

const adapter = new PrismaNeon(pool);

const db =
  globalForDb.prisma ??
  (new FullPrismaClient({
    adapter,
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
  }) satisfies DatabaseClient);

// store the singletons in dev to avoid leaks when reloading
if (env.NODE_ENV === "development") {
  globalForDb.pool = pool;
  globalForDb.prisma = db;
}

export { db };

// TODO: uncomment this
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

// Uncomment this line - it's needed for Node.js environments
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
      maxWait: 4000,
      timeout: 10000,
      isolationLevel: "ReadCommitted",
    },
  }) satisfies DatabaseClient);

// store the singletons in dev to avoid leaks when reloading
if (env.NODE_ENV === "development") {
  globalForDb.pool = pool;
  globalForDb.prisma = db;
}

export { db };

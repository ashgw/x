import "server-only";

import type { MaybeUndefined } from "ts-roids";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

import { env } from "@ashgw/env";

import { PrismaClient as FullPrismaClient } from "./generated/client";

// purge unused methods
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

// cache both pool and prisma client in globalThis to avoid recreating on hot reloads
const globalForDb = globalThis as unknown as {
  pool: MaybeUndefined<Pool>;
  prisma: MaybeUndefined<DatabaseClient>;
};

// configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// cache the Neon connection pool as well
const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: env.DATABASE_URL,
  });

// create the Prisma adapter using the cached or new pool
const adapter = new PrismaNeon(pool);

// cache the Prisma client itself
const db =
  globalForDb.prisma ??
  new FullPrismaClient({
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
  }) satisfies DatabaseClient;

// in dev mode, store both pool and prisma globally to avoid leaks during hot reloads
if (env.NODE_ENV === "development") {
  globalForDb.pool = pool;
  globalForDb.prisma = db;
}

export { db };


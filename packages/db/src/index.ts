import "server-only";

import type { MaybeUndefined } from "ts-roids";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

import { env } from "@ashgw/env";
import { logger } from "@ashgw/observability";

import { PrismaClient } from "./generated/client";

const isBuildProcess =
  process.env.NODE_ENV === "production" && typeof window === "undefined";

// only go ahead & import WebSocket in a Node.js environment that's not a build process
if (typeof window === "undefined" && !isBuildProcess) {
  // this is a safe way to conditionally import WebSocket without require()
  // and without triggering the import during build time
  import("ws")
    .then((wsModule) => {
      neonConfig.webSocketConstructor = wsModule.default;
    })
    .catch((err) => {
      // silent fail during build is acceptable
      if (process.env.NODE_ENV === "development") {
        logger.error("Failed to import WebSocket:", err);
      }
    });
}

export type DatabaseClient = Omit<
  PrismaClient,
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

// Global cache for hot reload
const globalForDb = globalThis as unknown as {
  pool: MaybeUndefined<Pool>;
  prisma: MaybeUndefined<DatabaseClient>;
};

function createPrismaClient(): DatabaseClient {
  const pool =
    globalForDb.pool instanceof Pool
      ? globalForDb.pool
      : new Pool({ connectionString: env.DATABASE_URL });

  const adapter = new PrismaNeon(pool);

  const prisma = new PrismaClient({
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
  });

  // Store pool and client in dev for HMR
  if (env.NODE_ENV === "development") {
    globalForDb.pool = pool;
    globalForDb.prisma = prisma;
  }

  return prisma;
}

export const db = globalForDb.prisma ?? createPrismaClient();

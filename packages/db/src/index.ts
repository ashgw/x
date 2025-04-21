import "server-only";

import type { MaybeUndefined } from "ts-roids";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

import { env } from "@ashgw/env";

import { PrismaClient as FullPrismaClient } from "./generated/client";

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

// This creates a custom property on global (actually globalThis) to store a cached Prisma instance in dev mode.
// This is required because otherwise, every reload (in next dev, tsx, etc.) creates a new Prisma connection
const globalForPrisma = global as unknown as {
  prisma: MaybeUndefined<DatabaseClient>;
};

neonConfig.webSocketConstructor = ws;

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const adapter = new PrismaNeon(pool);

// creates a singleton db object: use the existing one if it’s already in memory (globalThis.prisma)
// otherwise instantiate a new one. Clean and connection-safe.
export const db =
  globalForPrisma.prisma ??
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

// In dev only, we cache this Prisma instance globally to prevent connection overflow.
if (env.NODE_ENV === "development") {
  globalForPrisma.prisma = db;
}

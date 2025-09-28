import type { PrismaClientOptions } from "@prisma/client/runtime/library";
import type { MaybeUndefined } from "ts-roids";
import { env } from "@ashgw/env";
import { PrismaClient as FullPrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export type DatabaseClient = Omit<
  FullPrismaClient,
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

// Cache for hot-reloads in Next.js dev
const globalForDb = globalThis as unknown as {
  prisma: MaybeUndefined<DatabaseClient>;
};

const errorFormat: PrismaClientOptions["errorFormat"] = "pretty";
const log: PrismaClientOptions["log"] =
  env.NODE_ENV === "development"
    ? ["query", "info", "warn", "error"]
    : ["error"];

const transactionOptions = {
  maxWait: 10_000,
  timeout: 30_000,
  isolationLevel: "ReadCommitted",
} as const;

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

// engineType = "client" is released in sep/'25
const db =
  globalForDb.prisma ??
  (new FullPrismaClient({
    datasourceUrl: env.DATABASE_URL,
    errorFormat,
    adapter,
    log,
    transactionOptions,
  }) satisfies DatabaseClient);

// Store the singleton during dev to avoid multiple instances
if (env.NODE_ENV === "development") {
  globalForDb.prisma = db;
}

export { db };

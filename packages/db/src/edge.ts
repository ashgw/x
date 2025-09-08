import type { PrismaClientOptions } from "@prisma/client/runtime/client";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import type { MaybeUndefined } from "ts-roids";
import { env } from "@ashgw/env";

export type EdgeDatabaseClient = Omit<
  PrismaClient,
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

const globalForDb = globalThis as unknown as {
  edgePrisma: MaybeUndefined<EdgeDatabaseClient>;
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

// Key bit: route pooling over fetch; no `ws`, safe on Edge.
neonConfig.poolQueryViaFetch = true;

const adapter = new PrismaNeon({ connectionString: env.DATABASE_URL });

const edgeDb =
  globalForDb.edgePrisma ??
  new PrismaClient({ adapter, errorFormat, log, transactionOptions });

if (env.NODE_ENV === "development") globalForDb.edgePrisma = edgeDb;

export { edgeDb };

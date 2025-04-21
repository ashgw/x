import "server-only";

import type { MaybeUndefined } from "ts-roids";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

import { env } from "@ashgw/env";

import { PrismaClient } from "./generated/client";

const globalForPrisma = global as unknown as {
  prisma: MaybeUndefined<PrismaClient>;
};

neonConfig.webSocketConstructor = ws;

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});
const adapter = new PrismaNeon(pool);

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export * from "./generated/client";

import type { DatabaseClient } from "@ashgw/db";

export interface TsrContext {
  ctx: {
    requestedAt: Date;
    db: DatabaseClient;
  };
}

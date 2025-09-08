import type { DatabaseClient } from "@ashgw/db";

// TODO: add docs here
export interface TsrContext {
  ctx: {
    requestedAt: Date;
    db: DatabaseClient;
  };
}

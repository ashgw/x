import type { DatabaseClient } from "@ashgw/db";

export interface TsrContext {
  ctx: {
    time: Date;
    db: DatabaseClient;
  };
}

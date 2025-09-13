import type { DatabaseClient } from "@ashgw/db";
import type { GlobalTsrContext } from "~/@ashgw/ts-rest";

export interface GlobalContext extends GlobalTsrContext {
  ctx: {
    requestedAt: Date;
    db: DatabaseClient;
  };
}

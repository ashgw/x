import type { DatabaseClient } from "@ashgw/db";
import type { GlobalTsrContext } from "~/@ashgw/ts-rest";

export interface GlobalContext extends GlobalTsrContext {
  // TODO: tell the user that it must  be extend like this
  /*
   */
  ctx: {
    requestedAt: Date;
    db: DatabaseClient;
  };
}

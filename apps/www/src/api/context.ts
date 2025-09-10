import type { DatabaseClient } from "@ashgw/db";
import type { GlobalTsrContext } from "~/@ashgw/ts-rest";

export interface GlobalContext extends GlobalTsrContext {
  // must extend like this
  // TODO: actually fix, to where we can do this
  /* 
  
  export interface GlobalContext extends GlobalTsrContext {
    requestedAt: Date;
    db: DatabaseClient;
  };
  and it apends whatever we put here in the ctx object, mening we can acces 
  ctx.db and ctx.requestAt, or whatever we extend the globaltsr conext with
  */
  ctx: {
    requestedAt: Date;
    db: DatabaseClient;
  };
}

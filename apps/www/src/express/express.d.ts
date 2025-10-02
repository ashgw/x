import type { DatabaseClient } from "@ashgw/db";
import "express";

declare module "express-serve-static-core" {
  interface Request {
    ctx: {
      db: DatabaseClient;
    };
  }
}

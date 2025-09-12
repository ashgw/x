import { env } from "@ashgw/env";
import type { SequentialMiddlewareRo } from "~/@ashgw/ts-rest";
import { middlewareResponse, middlewareFn } from "~/@ashgw/ts-rest";
import type { GlobalContext } from "~/ts-rest/context";
import type { EmptyObject } from "ts-roids";

type CronAuthedContext = EmptyObject; //  nothing we need to pass down here really

export function cornAuthed(): SequentialMiddlewareRo<CronAuthedContext> {
  const mw = middlewareFn<GlobalContext, CronAuthedContext>((req, _res) => {
    if (req.headers.get("x-cron-token") !== env.X_CRON_TOKEN) {
      return middlewareResponse.errors.unauthorized({
        message: "Invalid token. You cannot perform this action",
      });
    }
  });

  middlewareResponse.errors.unauthorized({
    message: "Invalid token. You cannot perform this action",
  });
  return {
    mw,
    ctx: {},
  };
}

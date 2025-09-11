import { env } from "@ashgw/env";
import type { SequentialMiddlewareRo } from "~/@ashgw/ts-rest";
import { middlewareResponse, middlewareFn } from "~/@ashgw/ts-rest";
import type { GlobalContext } from "~/ts-rest/context";
import type { EmptyObject } from "ts-roids";

type CronAuthedContext = EmptyObject; //  nothing we need to pass down here really

export function cornAuthed(): SequentialMiddlewareRo<CronAuthedContext> {
  const mw = middlewareFn<GlobalContext, CronAuthedContext>((req, _res) => {
    // zod already parsed it since it's declared in the contract as a header so this we got here is correct
    if (req.headers.get("x-cron-token") !== env.X_CRON_TOKEN) {
      return middlewareResponse.error({
        status: 401,
        body: {
          code: "UNAUTHORIZED",
          message: "Invalid token. You cannot perform this action",
        },
      });
    }
  });

  return {
    mw,
    ctx: {},
  };
}

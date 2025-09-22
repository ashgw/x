import { env } from "@ashgw/env";
import { middlewareResponse, middlewareFn } from "~/@ashgw/ts-rest";
import type { GlobalContext } from "~/ts-rest/context";
import type { EmptyObject } from "ts-roids";

type CronAuthedContext = EmptyObject; //  nothing we need to pass down here really

export function authed() {
  return middlewareFn<GlobalContext, CronAuthedContext>((req, _res) => {
    if (req.headers.get("x-api-token") !== env.X_API_TOKEN) {
      return middlewareResponse.errors.unauthorized({
        message: "Invalid token. You cannot perform this action",
      });
    }
  });
}

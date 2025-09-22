import { env } from "@ashgw/env";
import { middlewareResponse, middlewareFn } from "~/ts-rest-kit";
import type { GlobalContext } from "~/ts-rest/context";

interface AuthedCtx {
  user: {
    email: string;
    name: string;
  };
}

export function authed() {
  const user = {
    email: "admin@email.com",
    name: "admin",
  } as const;

  return middlewareFn<GlobalContext, AuthedCtx>((req, _res) => {
    if (req.headers.get("x-api-token") !== env.X_API_TOKEN) {
      return middlewareResponse.errors.unauthorized({
        message: "Invalid token. You cannot perform this action",
      });
    }
    return {
      ctx: { user },
    };
  });
}

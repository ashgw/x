import type { SequentialMiddlewareRo } from "~/@ashgw/ts-rest";
import { middlewareResponse, middlewareFn } from "~/@ashgw/ts-rest";
import type { GlobalContext } from "~/ts-rest/context";

interface AuthedContext {
  user: {
    email: string;
    name: string;
    role: "admin" | "visitor";
  } | null;
}

// TODO: document how to create a sequantial middleware with somewhat real auth
export function authed(): SequentialMiddlewareRo<AuthedContext> {
  const getUserSafe = (): AuthedContext["user"] | null => {
    if (Math.random() > 0.4) {
      return { email: "john@doe.com", name: "john", role: "admin" };
    } else return { email: "john@doe.com", name: "john", role: "admin" };
  };
  const user = getUserSafe();
  const mw = middlewareFn<GlobalContext, AuthedContext>((req, _res) => {
    if (user) {
      req.ctx.user = user; // TODO: tell the user that we always need to set the context here too
    } else {
      return middlewareResponse.error({
        body: {
          code: "UNAUTHORIZED",
          message: "Youre not authed!",
        },
      });
    }
  });
  return {
    mw,
    ctx: { user },
  };
}

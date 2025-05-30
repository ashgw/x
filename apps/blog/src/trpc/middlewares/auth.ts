import { TRPCError } from "@trpc/server";

import type { TrpcContext } from "../context";
import type { UserRo, UserRoleEnum } from "~/api/models";
import { AuthService } from "~/api/services";
import { middleware } from "./middleware";

async function isAuthenticated(input: { ctx: TrpcContext }): Promise<UserRo> {
  const user = await new AuthService({
    db: input.ctx.db,
    req: input.ctx.req,
    res: input.ctx.res,
  }).me();

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }
  return user;
}

function isAuthorized({
  user,
  requiredRole,
}: {
  user: UserRo;
  requiredRole: UserRoleEnum;
}): void {
  if (user.role !== requiredRole) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You don't have permission to access this resource",
    });
  }
}

export const authMiddleware = (input: {
  withAuthorization?: {
    requiredRole: UserRoleEnum;
  };
}) =>
  middleware(async (opts) => {
    const { ctx } = opts;
    const user = await isAuthenticated({
      ctx: ctx,
    });
    if (input.withAuthorization) {
      isAuthorized({
        requiredRole: input.withAuthorization.requiredRole,
        user,
      });
    }

    return opts.next({
      ctx: {
        ...ctx,
        user,
      },
    });
  });

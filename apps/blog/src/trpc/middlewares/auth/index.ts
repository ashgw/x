import type { UserRoleEnum } from "~/api/models";
import { middleware } from "~/trpc/root";
import { isAuthenticated } from "./authentication";
import { isAuthorized } from "./authorization";

export const authMiddleware = (input: {
  withAuthorization?: {
    requiredRole: UserRoleEnum;
  };
}) =>
  middleware(async (opts) => {
    const { ctx } = opts;
    const user = await isAuthenticated({ ctx });

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

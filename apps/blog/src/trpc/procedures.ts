import { UserRoleEnum } from "~/api/models";
import { authMiddleware } from "./middlewares/auth";
import { timingMiddleware } from "./middlewares/timing";
import { procedure } from "./root";
import type { RlWindow } from "limico";
import { rateLimiterMiddleware } from "./middlewares/rl";

const timedProcedure = procedure.use(timingMiddleware);

interface RlOpts {
  limit?: { every: RlWindow };
}

export function publicProcedure(opts?: RlOpts) {
  let proc = timedProcedure;
  if (opts?.limit?.every) {
    proc = proc.use(rateLimiterMiddleware({ limit: opts.limit }));
  }
  return proc;
}

export function authenticatedProcedure(opts?: RlOpts) {
  return publicProcedure(opts).use(authMiddleware({}));
}

function authorizedProcedure({
  requiredRole,
  limit,
}: {
  requiredRole: UserRoleEnum;
  limit?: { every: RlWindow };
}) {
  return publicProcedure({
    limit,
  }).use(
    authMiddleware({
      withAuthorization: {
        requiredRole,
      },
    }),
  );
}

export function adminProcedure(opts?: RlOpts) {
  return authorizedProcedure({
    requiredRole: UserRoleEnum.ADMIN,
    limit: opts?.limit,
  });
}

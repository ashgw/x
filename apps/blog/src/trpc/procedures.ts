import { UserRoleEnum } from "~/api/models";
import { authMiddleware } from "./middlewares/auth";
import { timingMiddleware } from "./middlewares/timing";
import { procedure } from "./root";
import type { RlWindow } from "@ashgw/rate-limiter";
import { rateLimiterMiddleware } from "./middlewares/rl";

const timedProcedure = procedure.use(timingMiddleware);

export function publicProcedure(opts?: {
  withRatelimit?: { limit: { every: RlWindow } };
}) {
  let proc = timedProcedure;
  if (opts?.withRatelimit) {
    proc = proc.use(rateLimiterMiddleware({ ...opts.withRatelimit }));
  }
  return proc;
}

export function adminProcedure(opts?: {
  withRatelimit?: { limit: { every: RlWindow } };
}) {
  return publicProcedure(opts).use(
    authMiddleware({
      withAuthorization: {
        requiredRole: UserRoleEnum.ADMIN,
      },
    }),
  );
}

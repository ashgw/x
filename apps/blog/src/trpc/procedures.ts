import { UserRoleEnum } from "~/api/models";
import { authMiddleware } from "./middlewares/auth";
import { timingMiddleware } from "./middlewares/timing";
import { procedure } from "./root";
import type { RlWindow } from "@ashgw/rate-limiter";
import { rateLimiterMiddleware } from "./middlewares/rl";

const timedProcedure = procedure.use(timingMiddleware);

export function publicProcedure(opts?: { limit?: { every: RlWindow } }) {
  let proc = timedProcedure;
  if (opts?.limit?.every) {
    proc = proc.use(rateLimiterMiddleware({ limit: opts.limit }));
  }
  return proc;
}

export function adminProcedure(opts?: { limit?: { every: RlWindow } }) {
  return publicProcedure(opts).use(
    authMiddleware({
      withAuthorization: {
        requiredRole: UserRoleEnum.ADMIN,
      },
    }),
  );
}

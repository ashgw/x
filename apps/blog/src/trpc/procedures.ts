import { UserRoleEnum } from "~/api/models";
import { authMiddleware } from "./middlewares/auth";
import { timingMiddleware } from "./middlewares/timing";
import { procedure } from "./root";
import type { RlWindow } from "limico";
import { rateLimiterMiddleware } from "./middlewares/rl";

const timedProcedure = procedure.use(timingMiddleware);

type RlKind = "interval" | "quota";

export type RateLimitOptions =
  | {
      kind: "interval";
      limit: {
        every: RlWindow;
      };
    }
  | {
      kind: "quota";
      limit: {
        every: RlWindow;
        hits: number;
      };
    };

export function publicProcedure(opts?: RateLimitOptions) {
  let proc = timedProcedure;
  if (opts) {
    proc = proc.use(rateLimiterMiddleware({ limit: opts.limit }));
  }
  return proc;
}

export function authenticatedProcedure(opts?: RateLimitOptions) {
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

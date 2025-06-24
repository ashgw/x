import { UserRoleEnum } from "~/api/models";
import { authMiddleware } from "./middlewares/auth";
import { timingMiddleware } from "./middlewares/dev-latency";
import { procedure } from "./root";

export const publicProcedure = procedure.use(timingMiddleware);

export const adminProcedure = publicProcedure.use(
  authMiddleware({
    withAuthorization: {
      requiredRole: UserRoleEnum.ADMIN,
    },
  }),
);

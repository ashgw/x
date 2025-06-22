import { UserRoleEnum } from "~/api/models";
import { authMiddleware } from "./middlewares/auth";
import { procedure } from "./root";

export const publicProcedure = procedure;

export const adminProcedure = publicProcedure.use(
  authMiddleware({
    withAuthorization: {
      requiredRole: UserRoleEnum.ADMIN,
    },
  }),
);

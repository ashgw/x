import { UserRoleEnum } from "~/api/models";
import { authMiddleware } from "./middlewares/auth";
import { t } from "./trpc";

export const createCallerFactory = t.createCallerFactory;
export const router = t.router;
export const publicProcedure = t.procedure;

export const adminProcedure = publicProcedure.use(
  authMiddleware({ requiredRole: UserRoleEnum.ADMIN }),
);

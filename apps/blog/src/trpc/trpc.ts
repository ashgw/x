import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";

import type { TrpcContext } from "./context";
import { UserRoleEnum } from "~/api/models";
import { transformer } from "./transformer";

const t = initTRPC.context<TrpcContext>().create({
  transformer,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

function isAuthenticated(ctx: TrpcContext) {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }
  return ctx;
}

function isAuthorized({
  ctx,
  requiredRole,
}: {
  ctx: TrpcContext;
  requiredRole: UserRoleEnum;
}) {
  if (ctx.user?.role !== requiredRole) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You don't have permission to access this resource",
    });
  }
  return ctx;
}

const authMiddleware = (input: { requiredRole: UserRoleEnum }) =>
  middleware(async (opts) => {
    const { ctx } = opts;
    isAuthenticated(ctx);
    isAuthorized({ ctx, requiredRole: input.requiredRole });
    return opts.next({
      ctx: {
        ...ctx,
      },
    });
  });

export const adminProcedure = publicProcedure.use(
  authMiddleware({ requiredRole: UserRoleEnum.ADMIN }),
);

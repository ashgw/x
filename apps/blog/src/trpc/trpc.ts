import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

import type { TrpcContext } from "./context";
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

// extract this somewhere else if implemented
function isAuthenticated(input: { ctx: TrpcContext }) {
  const { ctx } = input;
  return ctx;
}

// same here
function isAuthorized(input: { ctx: TrpcContext }) {
  const { ctx } = input;
  return ctx;
}

const authMiddleware = middleware(async (opts) => {
  const { ctx } = opts;
  isAuthenticated({ ctx });
  isAuthorized({ ctx });
  return opts.next({
    ctx: {
      ...ctx,
    },
  });
});

export const authedProcedure = publicProcedure.use(authMiddleware);

export const adminProcedure = authedProcedure.use(authMiddleware);

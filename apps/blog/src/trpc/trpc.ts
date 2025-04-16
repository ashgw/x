import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

import type { TrpcContext } from "./contex";
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

function isAutheticated(input: { ctx: TrpcContext }) {
  const { ctx } = input;
  return ctx;
}

function isAuthorized(input: { ctx: TrpcContext }) {
  const { ctx } = input;
  return ctx;
}

const authMiddleware = middleware((opts) => {
  const { ctx } = opts;
  isAutheticated({ ctx });
  isAuthorized({ ctx });
  return opts.next({
    ctx: {
      ...ctx,
    },
  });
});

export const authedProcedure = () => {
  return publicProcedure.use(authMiddleware);
};

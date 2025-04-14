import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

import type { Context } from "./context";
import { transformer } from "./transformer";

const t = initTRPC.context<Context>().create({
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

export const router = t.router;
export const publicProcedure = t.procedure;

export const middleware = t.middleware;

const isAuthed = middleware((opts) => {
  const { ctx } = opts;

  return opts.next({
    ctx: {
      ...ctx,
    },
  });
});

export const authedProcedure = t.procedure.use(isAuthed);

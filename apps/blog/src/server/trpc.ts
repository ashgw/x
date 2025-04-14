import { initTRPC } from "@trpc/server";

import type { Context } from "./context";

const t = initTRPC.context<Context>().create();

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

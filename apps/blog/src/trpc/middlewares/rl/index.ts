import { middleware } from "~/trpc/root";
import { TRPCError } from "@trpc/server";
import type { RlWindow } from "limico";
import { createLimiter } from "limico";
import { getFingerprint } from "@ashgw/security";

interface Ops {
  hits: number;
  every: RlWindow;
}

export const rateLimiterMiddleware = (input: Ops) =>
  middleware(async ({ ctx, next }) => {
    const rl = createLimiter({
      kind: "quota",
      limit: input.hits,
      window: input.every,
    });

    const pass = await rl.allow(getFingerprint({ req: ctx.req }));
    if (!pass.allowed) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: `Too many requests. Try again in ${input.every}.`,
      });
    }
    return next({
      ctx: {
        ...ctx,
        rateLimitWindow: input.every,
      },
    });
  });

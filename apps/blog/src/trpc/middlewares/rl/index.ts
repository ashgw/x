import { middleware } from "~/trpc/root";
import { RateLimiterService } from "limico";
import type { RlWindow } from "limico";
import { TRPCError } from "@trpc/server";

const rl = new RateLimiterService("1s");

export const rateLimiterMiddleware = (input: {
  limit: {
    every: RlWindow;
  };
}) =>
  middleware(async ({ ctx, next }) => {
    rl.updateWindow(input.limit.every);
    if (!rl.canPass(rl.fp({ req: ctx.req }))) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: `Too many requests. Try again in ${rl.every}.`,
      });
    }
    return next({
      ctx: {
        ...ctx,
        rateLimitWindow: rl.every,
      },
    });
  });

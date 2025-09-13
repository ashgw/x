import { middleware } from "~/trpc/root";
import { RateLimiterService } from "@ashgw/rate-limiter";
import type { RlWindow } from "@ashgw/rate-limiter";
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
        message: `Rate limited. Try again in ${rl.every}.`,
      });
    }
    return next({
      ctx: {
        ...ctx,
        rateLimitWindow: rl.every,
      },
    });
  });

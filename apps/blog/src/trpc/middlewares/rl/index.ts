import { middleware } from "~/trpc/root";
import { RateLimiterService } from "@ashgw/rate-limiter";
import type { RlWindow } from "@ashgw/rate-limiter";
import { TRPCError } from "@trpc/server";

export const rateLimiterMiddleware = (input: {
  limit: {
    every: RlWindow;
  };
}) =>
  middleware(async ({ ctx, next }) => {
    const rl = new RateLimiterService(input.limit.every);
    if (!rl.canPass(rl.fp({ req: ctx.req }))) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `You're limited for the next ${input.limit.every}`,
      });
    }
    return next({
      ctx: {
        ...ctx,
        rateLimitWindow: rl.every,
      },
    });
  });

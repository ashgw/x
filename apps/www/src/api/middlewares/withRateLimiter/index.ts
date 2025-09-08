import { createMiddleware } from "~/api/middleware";
import { middlewareFn } from "~/api/middleware";
import type { ContractRoute } from "~/api/middleware";
import { getFingerprint } from "./getFingerprint";
import type { RateLimiter } from "./rl";
import { createRateLimiter } from "./rl";
import type { RlWindow } from "./window";
import { makeSchemaResponse } from "~/api/extended";
import { httpErrorSchemaRo } from "~/api/schemas/ros";
import type { InferResponses } from "~/api/extended";
import { NextResponse } from "next/server";

interface RateLimiterCtx {
  rl: RateLimiter;
}

const _rlResponse = makeSchemaResponse({
  401: httpErrorSchemaRo,
});

type RlResponse = InferResponses<typeof _rlResponse>;

export function withRateLimiter<R extends ContractRoute>({
  route,
  limit,
}: {
  route: R;
  limit: { every: RlWindow };
}) {
  const { rl } = createRateLimiter(limit.every);
  return createMiddleware<R, RateLimiterCtx>({
    route,
    middlewareFn: middlewareFn<RateLimiterCtx>((req, _res) => {
      req.ctx.rl = rl;
      if (!req.ctx.rl.canPass(getFingerprint({ req }))) {
        const denyResponse = {
          status: 401,
          body: {
            code: "FORBIDDEN",
            message: `Youre limited for the next ${limit.every}`,
          },
        } satisfies RlResponse;
        return NextResponse.json(denyResponse.body, {
          status: denyResponse.status,
        });
      }
    }),
  });
}

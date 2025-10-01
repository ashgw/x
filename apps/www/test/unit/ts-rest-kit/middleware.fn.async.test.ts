import { describe, it, expect } from "vitest";
import { middlewareFn, middlewareResponse } from "ts-rest-kit/core";
import type { MiddlewareRequest } from "ts-rest-kit/core";
import type { GlobalTsrContext } from "ts-rest-kit/core";

interface G extends GlobalTsrContext {
  ctx: { user?: string };
}

describe("middlewareFn async behavior and short circuit", () => {
  it("awaits async fn and short circuits when Response returned", async () => {
    const mw = middlewareFn<G, { userId: string }>(async (req) => {
      await Promise.resolve();
      req.ctx.user = "john";
      return middlewareResponse.errors.forbidden({ message: "no" });
    });

    const fake = { ctx: {} } as unknown as MiddlewareRequest<
      G,
      { userId: string }
    >;
    const out = await mw(fake);
    expect(out).toBeInstanceOf(Response);
  });

  it("can return ctx fragment asynchronously", async () => {
    const mw = middlewareFn<G, { traceId: string }>(async () => {
      await Promise.resolve();
      return { ctx: { traceId: "t-1" } };
    });
    const fake = { ctx: {} } as unknown as MiddlewareRequest<
      G,
      { traceId: string }
    >;
    const out = await mw(fake);
    expect(out && typeof out === "object" && "ctx" in out).toBe(true);
    // @ts-expect-no-error at runtime
    expect((out as { ctx: { traceId: string } }).ctx.traceId).toBe("t-1");
  });
});

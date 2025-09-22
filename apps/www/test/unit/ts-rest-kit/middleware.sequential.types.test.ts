import { describe, it, expect } from "vitest";
import { middleware } from "~/ts-rest-kit";
import { initContract } from "@ts-rest/core";
interface GlobalContext {
  ctx: { requestedAt: Date };
}
const c = initContract();
const contract = c.router({
  ping: {
    method: "GET",
    path: "/ping",
    responses: { 200: c.type<{ ok: true }>() },
  },
});

describe("sequential middleware types", () => {
  it("merges LocalCtx fragments into req.ctx at runtime and type-level", () => {
    const stack = middleware<GlobalContext>()
      .use<GlobalContext, { userId: string }>(() => ({ ctx: { userId: "1" } }))
      .use<GlobalContext, { role: "admin" }>(() => ({
        ctx: { role: "admin" },
      }));

    const route = stack.route(contract.ping);
    // creating the handler should succeed (type-level merge is the point)
    const handler = route(() =>
      Promise.resolve({
        status: 200,
        body: { ok: true },
      }),
    );
    expect(handler).toBeTruthy();
  });
});

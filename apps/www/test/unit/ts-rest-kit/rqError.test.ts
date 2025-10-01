import { describe, it, expect } from "vitest";
import { rqError } from "~/ts-rest-kit";

describe("rqError", () => {
  it("parses ts-rest shaped error with code/message", () => {
    const e = {
      status: 401,
      body: { code: "UNAUTHORIZED", message: "Invalid token" },
      headers: {},
    };
    const out = rqError(e);
    expect(out?.status).toBe(401);
    expect(out?.code).toBe("UNAUTHORIZED");
    expect(out?.message).toBe("Invalid token");
  });

  it("extracts Retry-After seconds", () => {
    const e = {
      status: 429,
      body: { code: "TOO_MANY_REQUESTS", message: "slow down" },
      headers: { "Retry-After": "7" },
    };
    const out = rqError(e);
    expect(out?.status).toBe(429);
  });

  it("falls back to HTTP <status> when body is weird", () => {
    const e = { status: 500, body: {}, headers: {} };
    const out = rqError(e);
    expect(out?.message).toBe("HTTP 500");
    expect(out?.status).toBe(500);
  });

  it("handles random junk", () => {
    const out = rqError({ foo: 1 });
    expect(out?.message).toBe("Unexpected error");
  });
});

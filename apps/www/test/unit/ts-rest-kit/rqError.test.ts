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
    expect(out).toBe("Invalid token");
  });

  it("falls back to HTTP <status> when body is weird", () => {
    const e = { status: 500, body: {}, headers: {} };
    const out = rqError(e);
    expect(out).toBe("HTTP 500");
  });

  it("handles random junk", () => {
    const out = rqError({ foo: 1 });
    expect(out).toBe("Unexpected error");
  });
});

import { describe, it, expect } from "vitest";
import { middlewareResponse } from "~/ts-rest-kit/middleware/response";

describe("middlewareResponse.errors.tooManyRequests", () => {
  it("adds integer Retry-After header and clamps to at least 1", () => {
    const r1 = middlewareResponse.errors.tooManyRequests({
      body: { message: "slow" },
      retryAfterSeconds: 7.8,
    });
    expect((r1 as Response).status).toBe(429);
    expect((r1 as Response).headers.get("Retry-After")).toBe("7");

    const r2 = middlewareResponse.errors.tooManyRequests({
      body: { message: "slow" },
      retryAfterSeconds: 0.2,
    });
    expect((r2 as Response).headers.get("Retry-After")).toBe("1");
  });
});

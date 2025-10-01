import { describe, it, expect } from "vitest";
import { middlewareResponse } from "~/ts-rest-kit/middleware/response";

describe("middlewareResponse.generic edge cases", () => {
  it("204 with undefined body yields empty payload", async () => {
    const res = middlewareResponse.generic({ status: 204, body: undefined });
    expect(res).toBeInstanceOf(Response);
    // No JSON content, empty string body
    const txt = await (res as Response).text();
    expect(txt).toBe("");
    expect((res as Response).status).toBe(204);
  });

  it("200 with JSON object stringifies correctly", async () => {
    const res = middlewareResponse.generic({
      status: 200,
      body: { a: 1, b: "x" },
      headers: { "x-test": "y" },
    });
    expect(res).toBeInstanceOf(Response);
    expect((res as Response).status).toBe(200);
    expect((res as Response).headers.get("x-test")).toBe("y");
    const json = await (res as Response).json();
    expect(json).toEqual({ a: 1, b: "x" });
  });
});

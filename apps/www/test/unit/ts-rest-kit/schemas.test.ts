import { describe, it, expect } from "vitest";
import { z } from "zod";
import { httpErrorSchema, createSchemaResponses } from "~/ts-rest-kit";
import { initContract } from "@ts-rest/core";
const c = initContract();

describe("ts-rest-kit schemas", () => {
  it("httpErrorSchema locks the error code and validates shape", () => {
    const schema = httpErrorSchema.unauthorized();
    const out = schema.parse({ code: "UNAUTHORIZED", message: "sign in" });
    expect(out.code).toBe("UNAUTHORIZED");

    expect(() =>
      schema.parse({ code: "BAD_REQUEST", message: "no" }),
    ).toThrow();
  });

  it("createSchemaResponses returns same object preserving literal types", () => {
    const resp = createSchemaResponses({
      200: c.type<{ ok: true }>(),
      401: httpErrorSchema.unauthorized(),
    });

    // runtime structural expectations
    expect(Object.keys(resp)).toEqual(["200", "401"]);
  });

  it("accepts zod schemas and that they validate", () => {
    const schema = z.object({ a: z.number().int().positive() });
    const parsed = schema.parse({ a: 1 });
    expect(parsed.a).toBe(1);
  });
});



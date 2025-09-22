import { describe, it, expect } from "vitest";
import { z } from "zod";
import type { TestType } from "ts-roids";
import type { InferRequest, InferResponses } from "~/ts-rest-kit";
import { initContract } from "@ts-rest/core";

const c = initContract();

// Contract to validate InferResponses type behavior
const _responses = {
  200: c.type<{ ok: true }>(),
  204: c.noBody(),
  400: z.object({ code: z.literal("BAD_REQUEST"), message: z.string() }),
  500: z.null(),
} as const;

type R = InferResponses<typeof _responses>;

// Request inference
const _bodySchema = z.object({ name: z.string(), age: z.number().int() });
type Body = InferRequest<typeof _bodySchema>;

describe("ts-rest-kit inference", () => {
  it("InferRequest infers zod schema shape", () => {
    const sample: Body = { name: "john", age: 22 };
    expect(typeof sample.name).toBe("string");
    expect(typeof sample.age).toBe("number");
  });

  // Type-level checks (no runtime effect)
  type _checkBody = TestType<Body, { name: string; age: number }, true>;
  type _check200Body = TestType<
    Extract<R, { status: 200 }>["body"],
    { ok: true },
    true
  >;
  type _check204Body = TestType<
    Extract<R, { status: 204 }>["body"],
    undefined,
    true
  >;
  type _check400Body = TestType<
    Extract<R, { status: 400 }>["body"],
    { code: "BAD_REQUEST"; message: string },
    true
  >;
  type _check500Body = TestType<
    Extract<R, { status: 500 }>["body"],
    null,
    true
  >;

  it("InferResponses yields discriminated union by status with proper bodies", () => {
    const ok = { status: 200, body: { ok: true } } as Extract<
      R,
      { status: 200 }
    >;
    const noBody = { status: 204, body: undefined } as Extract<
      R,
      { status: 204 }
    >;
    const bad = {
      status: 400,
      body: { code: "BAD_REQUEST", message: "x" },
    } as Extract<R, { status: 400 }>;
    const internal = { status: 500, body: null } as Extract<R, { status: 500 }>;

    expect(ok.body.ok).toBe(true);
    expect(noBody.body).toBeUndefined();
    expect(bad.body.code).toBe("BAD_REQUEST");
    expect(internal.body).toBeNull();
  });
});

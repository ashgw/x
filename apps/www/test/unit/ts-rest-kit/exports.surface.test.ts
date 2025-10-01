import { describe, it, expect } from "vitest";
import * as kit from "~/ts-rest-kit";

describe("public API surface exports", () => {
  const required = [
    "createContract",
    "middleware",
    "middlewareResponse",
    "middlewareFn",
    "responseHandlersFn",
    "createRouterWithContext",
    "createGlobalRequestMiddleware",
    "httpErrorSchema",
    "createSchemaResponses",
  ];
  for (const key of required) {
    it(`exports ${key}`, () => {
      expect(kit).toHaveProperty(key);
      expect(typeof (kit as Record<string, unknown>)[key]).not.toBe(
        "undefined",
      );
    });
  }
});

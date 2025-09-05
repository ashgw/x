import { z } from "zod";
import type { AppRoute, ServerInferResponses } from "@ts-rest/core";

export const errorSchemaRo = z.object({
  code: z
    .enum([
      "UPSTREAM_ERROR",
      "INTERNAL_ERROR",
      "BAD_REQUEST",
      "NOT_FOUND",
      "UNAUTHORIZED",
      "FORBIDDEN",
    ])
    .describe("Stable, machine-parseable error code"),
  message: z.string().min(1).max(1000).describe("Human readable"),
  details: z.record(z.any()).optional().describe("Optional extra context"),
});

export type ErrorRo = z.infer<typeof errorSchemaRo>;

export type RouteResp<R extends AppRoute> = ServerInferResponses<R>;

export interface Ok<Body> {
  status: 200;
  body: Body;
  headers?: Record<string, string>;
}

interface Headers {
  headers?: Record<string, string>;
}

export type Fail =
  | ({ status: 424; body: ErrorRo } & Headers)
  | ({ status: 500; body: ErrorRo } & Headers);

export type UpstreamResp<Body> = Ok<Body> | Fail;

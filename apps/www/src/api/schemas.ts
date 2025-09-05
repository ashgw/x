import { z } from "zod";
export const httpErrorSchema = z.object({
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

export type HTTPError = z.infer<typeof httpErrorSchema>;

interface Headers {
  headers?: Record<string, string>;
}

export interface Ok<Body> extends Headers {
  status: 200;
  body: Body;
}

export type Fail =
  | ({ status: 424; body: HTTPError } & Headers)
  | ({ status: 500; body: HTTPError } & Headers);

export type UpstreamResp<Body> = Ok<Body> | Fail;

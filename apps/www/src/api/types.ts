import type { AppRoute, ServerInferResponses } from "@ts-rest/core";
import type { ErrorRo } from "./schemas";

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

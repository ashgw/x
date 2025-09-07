import type { z } from "zod";
import type {
  AppRoute,
  AppRouter,
  AppRouteResponse,
  ContractOtherResponse,
  ContractPlainType,
  ContractNullType,
  ContractNoBodyType,
  ServerInferRequest,
  ServerInferResponses,
} from "@ts-rest/core";
import type { EmptyObject, Keys } from "ts-roids";

export type Awaitable<T> = T | Promise<T>;

/**
 * Derive handler arg shapes from a route using ts-rest's ServerInferRequest.
 * Produces an object with optional params/query/body keys when present.
 */
type ReqFor<R extends AppRoute> = (ServerInferRequest<R> extends {
  params: infer P;
}
  ? { params: P }
  : EmptyObject) &
  (ServerInferRequest<R> extends { query: infer Q }
    ? { query: Q }
    : EmptyObject) &
  (ServerInferRequest<R> extends { body: infer B } ? { body: B } : EmptyObject);

/**
 * Controller shape that matches your contract. Each route gets a function
 * that returns ServerInferResponses for that specific route.
 */
export type ControllerShape<C extends AppRouter> = {
  [K in Keys<C>]: C[K] extends AppRoute
    ? (args: ReqFor<C[K]>) => Awaitable<ServerInferResponses<C[K]>>
    : never;
};

/**
 * Map of HTTP status to any allowed ts-rest response spec.
 */
export type ResponsesMap = Record<number, AppRouteResponse>;

/**
 * Unwrap any "contract any" container into its runtime TS type.
 * - zod schema -> infer
 * - ContractPlainType<T> -> T
 * - ContractNullType | null -> null
 * - otherwise never (invalid in this context)
 */
type UnwrapContractAny<T> = T extends z.ZodTypeAny
  ? z.infer<T>
  : T extends ContractPlainType<infer P>
    ? P
    : T extends ContractNullType
      ? null
      : [T] extends [null]
        ? null
        : never;

/**
 * Compute the { body?: ... } fragment for a single AppRouteResponse variant.
 * - c.noBody() -> {}
 * - c.otherResponse({ body }) -> { body: UnwrapContractAny<body> }
 * - zod -> { body: infer }
 * - c.type<T>() -> { body: T }
 * - null or ContractNullType -> { body: null }
 */
type BodyFromResponse<R extends AppRouteResponse> = R extends ContractNoBodyType
  ? EmptyObject
  : R extends ContractOtherResponse<infer Inner>
    ? UnwrapContractAny<Inner> extends never
      ? never
      : { body: UnwrapContractAny<Inner> }
    : R extends z.ZodTypeAny
      ? { body: z.infer<R> }
      : R extends ContractPlainType<infer P>
        ? { body: P }
        : R extends ContractNullType
          ? { body: null }
          : [R] extends [null]
            ? { body: null }
            : never;

/**
 * Any response may include headers.
 */
type WithHeaders<T> = T & { headers?: Record<string, string> };

/**
 * Final union of response variants:
 * { status: <code>; body?: ...; headers?: Record<string, string> }
 * Works for every ts-rest response form.
 */
type StatusCodes<T> = Extract<keyof T, number>;

export type InferResponses<T extends ResponsesMap> = {
  [S in StatusCodes<T>]: WithHeaders<{ status: S } & BodyFromResponse<T[S]>>;
}[StatusCodes<T>];

/**
 * Simple helper when you just want zod->TS for a request schema.
 */
export type InferRequest<T extends z.ZodTypeAny> = z.infer<T>;

/**
 * Optional helpers if you want them downstream.
 * They do not change behavior, just convenience.
 */
export type ResponseFor<
  T extends ResponsesMap,
  S extends StatusCodes<T>,
> = WithHeaders<{ status: S } & BodyFromResponse<T[S]>>;

export type InferResponseBodies<T extends ResponsesMap> = {
  [S in StatusCodes<T>]: BodyFromResponse<T[S]> extends { body: infer B }
    ? B
    : never;
};

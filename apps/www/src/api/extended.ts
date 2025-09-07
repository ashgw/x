// types.ts
import type { z } from "zod";
import type {
  AppRoute,
  AppRouter,
  AppRouteResponse,
  ContractOtherResponse,
  ContractPlainType,
  ContractNullType,
  ServerInferRequest,
  ServerInferResponses,
  ContractNoBody,
} from "@ts-rest/core";
import type { EmptyObject, Keys } from "ts-roids";

export type Awaitable<T> = T | Promise<T>;

/* ---------- Controller arg inference ---------- */

type ReqFor<R extends AppRoute> = (ServerInferRequest<R> extends {
  params: infer P;
}
  ? { params: P }
  : EmptyObject) &
  (ServerInferRequest<R> extends { query: infer Q }
    ? { query: Q }
    : EmptyObject) &
  (ServerInferRequest<R> extends { body: infer B } ? { body: B } : EmptyObject);

export type ControllerShape<C extends AppRouter> = {
  [K in Keys<C>]: C[K] extends AppRoute
    ? (args: ReqFor<C[K]>) => Awaitable<ServerInferResponses<C[K]>>
    : never;
};

/* ---------- Response inference ---------- */

export type ResponsesMap = Record<number, AppRouteResponse>;

/** Unwrap zod / c.type<T>() / null containers to TS runtime type */
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
 * Body extractor that tolerates TS widening of `c.noBody()` to `symbol`.
 * - ContractNoBodyType -> {}
 * - symbol (widened noBody) -> {}
 * - otherResponse -> { body: ... }
 * - zod -> { body: ... }
 * - c.type<T>() -> { body: T }
 * - null/ContractNullType -> { body: null }
 */
type BodyFromResponseLoose<R> = R extends typeof ContractNoBody
  ? { body: undefined }
  : R extends symbol
    ? { body: undefined } // <- handles `{ 200: c.noBody() }` widening
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

type WithHeaders<T> = T & { headers?: Record<string, string> };
type StatusCodes<T> = Extract<keyof T, number>;

/**
 * Loosen the input constraint so plain objects work even if TS widens values.
 * Still produces the correct union `{ status; body?; headers? }`.
 */
export type InferResponses<T extends Record<number, unknown>> = {
  [S in StatusCodes<T>]: WithHeaders<
    { status: S } & BodyFromResponseLoose<T[S]>
  >;
}[StatusCodes<T>];

/* ---------- Requests ---------- */

export type InferRequest<T extends z.ZodTypeAny> = z.infer<T>;

export function schemaResponse<
  const R extends Record<number, AppRouteResponse>,
>(r: R): R {
  return r;
}

export const makeController =
  <C extends AppRouter>(_contract: C) =>
  <S extends ControllerShape<C>>(s: S): S =>
    s;

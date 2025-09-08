// TODO: create a seperate library for this one here
import type { z } from "zod";
import type {
  AppRouteResponse,
  ContractOtherResponse,
  ContractPlainType,
  ContractNullType,
  ContractNoBody,
} from "@ts-rest/core";

export type Awaitable<T> = T | Promise<T>;

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

export function ctreateSchemaResponses<
  const R extends Record<number, AppRouteResponse>,
>(r: R): R {
  return r;
}

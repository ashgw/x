import type { z } from "zod";
import type {
  AppRouteResponse,
  ContractOtherResponse,
  ContractPlainType,
  ContractNullType,
  ContractNoBodyType,
} from "@ts-rest/core";
import type { EmptyObject, Optional, Keys, IfExtends } from "ts-roids";

/** Map of status -> any ts-rest-supported response shape */
export type ResponsesMap = Record<number, AppRouteResponse>;

/** Unwrap the various body container types that ts-rest allows */
type UnwrapContractAny<T> =
  // zod schema -> infer the TS type
  T extends z.ZodTypeAny
    ? z.infer<T>
    : // c.type<T>() / ContractPlainType<T>
      T extends ContractPlainType<infer P>
      ? P
      : // explicit null body
        IfExtends<T, Optional<ContractNullType>, null, never>; // otherwise no valid body to infer

type BodyFromResponse<R extends AppRouteResponse> =
  // no-body response -> no body key
  R extends ContractNoBodyType
    ? EmptyObject
    : // otherResponse({ contentType, body: ... })
      R extends ContractOtherResponse<infer Inner>
      ? { body: UnwrapContractAny<Inner> }
      : // plain zod / plain type / null
        R extends z.ZodTypeAny
        ? { body: z.infer<R> }
        : R extends ContractPlainType<infer P>
          ? { body: P }
          : IfExtends<R, Optional<ContractNullType>, { body: null }, never>; // anything else is not a valid response spec

/** Optional headers on any response variant */
type WithHeaders<T> = T & { headers?: Record<string, string> };

/**
 * Final inference:
 * For a map like { 200: z.string(), 424: httpError, 500: httpError }
 * produce a union: { status: 200; body: string } | { status: 424; body: ... } | ...
 * Works for zod, plain types, null/no-body, and c.otherResponse(...)
 */
export type InferResponses<T extends ResponsesMap> = {
  [S in Extract<Keys<T>, number>]: WithHeaders<
    { status: S } & BodyFromResponse<T[S]>
  >;
}[Extract<Keys<T>, number>];

export type InferRequest<T extends z.ZodTypeAny> = z.infer<T>;

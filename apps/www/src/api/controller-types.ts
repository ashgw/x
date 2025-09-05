// controller-types.ts
import type {
  AppRoute,
  AppRouter,
  ServerInferRequest,
  ServerInferResponses,
} from "@ts-rest/core";
import type { EmptyObject } from "ts-roids";
export type Awaitable<T> = T | Promise<T>;

/** Only the fields you actually use. Keeps inference cheap. */
export type ReqFor<R extends AppRoute> = (ServerInferRequest<R> extends {
  params: infer P;
}
  ? { params: P }
  : EmptyObject) &
  (ServerInferRequest<R> extends { query: infer Q }
    ? { query: Q }
    : EmptyObject) &
  (ServerInferRequest<R> extends { body: infer B } ? { body: B } : EmptyObject);

/** Shape of the controllers, fully bound to the contract, status-agnostic. */
export type ControllerShape<C extends AppRouter> = {
  [K in keyof C]: C[K] extends AppRoute
    ? (args: ReqFor<C[K]>) => Awaitable<ServerInferResponses<C[K]>>
    : never;
};

/**
 * Optional helper if you insist on a builder. It’s intentionally trivial so
 * TS doesn’t re-instantiate huge generics. Using `satisfies` is even lighter.
 */
export const makeControllers =
  <C extends AppRouter>(_contract: C) =>
  <S extends ControllerShape<C>>(s: S): S =>
    s;

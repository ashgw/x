import type {
  AppRoute,
  AppRouter,
  ServerInferRequest,
  ServerInferResponses,
} from "@ts-rest/core";
import type { EmptyObject } from "ts-roids";

type RouteResp<R extends AppRoute> = ServerInferResponses<R>;

type ReqOf<R extends AppRoute> = ServerInferRequest<R>;

type ArgsFor<R extends AppRoute> = (ReqOf<R> extends { params: infer P }
  ? { params: P }
  : EmptyObject) &
  (ReqOf<R> extends { query: infer Q } ? { query: Q } : EmptyObject) &
  (ReqOf<R> extends { body: infer B } ? { body: B } : EmptyObject);

type ControllerShape<C extends AppRouter> = {
  [K in keyof C]: C[K] extends AppRoute
    ? (
        args: ArgsFor<Extract<C[K], AppRoute>>,
      ) => Promise<RouteResp<Extract<C[K], AppRoute>>>
    : never;
};

export const makeControllers =
  <C extends AppRouter>(_contract: C) =>
  (t: ControllerShape<C>): ControllerShape<C> =>
    t;

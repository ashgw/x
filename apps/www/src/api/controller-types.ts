import type {
  AppRoute,
  AppRouter,
  ServerInferRequest,
  ServerInferResponses,
} from "@ts-rest/core";

export type RouteResp<R extends AppRoute> = ServerInferResponses<R>;
export type ArgsFor<R extends AppRoute> = ServerInferRequest<R>;

export type Awaitable<T> = T | Promise<T>;

export type ControllerHandler<R extends AppRoute> = (
  args: ArgsFor<R>,
) => Awaitable<RouteResp<R>>;

export type ControllerShape<C extends AppRouter> = {
  [K in keyof C]: C[K] extends AppRoute ? ControllerHandler<C[K]> : never;
};

export type ControllersOf<C extends AppRouter> = ControllerShape<C>;

export const makeControllers =
  <C extends AppRouter>(_contract: C) =>
  (t: ControllerShape<C>): ControllerShape<C> =>
    t;

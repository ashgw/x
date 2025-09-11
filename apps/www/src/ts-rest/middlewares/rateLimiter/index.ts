import { getFingerprint } from "./getFingerprint";
import type { RateLimiter } from "./rl";
import { createRateLimiter } from "./rl";
import type { RlWindow } from "./window";
import type { MiddlewareFn } from "~/@ashgw/ts-rest";
import {
  middlewareResponse,
  middlewareFn,
  createRouteMiddleware,
} from "~/@ashgw/ts-rest";
import type { ContractRoute } from "~/api/contract";
import type { GlobalContext } from "~/ts-rest/context";

interface RateLimiterCtx {
  rl: RateLimiter;
}

export function rateLimiterMiddleware<Route extends ContractRoute>({
  route,
  limit,
}: {
  route: Route;
  limit: { every: RlWindow };
}) {
  const { rl } = createRateLimiter(limit.every);
  return createRouteMiddleware<Route, GlobalContext, RateLimiterCtx>({
    route,
    middlewareFn: middlewareFn<GlobalContext, RateLimiterCtx>((req, _res) => {
      req.ctx.rl = rl;
      if (!req.ctx.rl.canPass(getFingerprint({ req }))) {
        return middlewareResponse.error({
          status: 403,
          body: {
            code: "FORBIDDEN",
            message: `You're limited for the next ${req.ctx.rl.every}`,
          },
        });
      }
    }),
  });
}

interface SequentialMiddlewareRo<LocalCtx> {
  ctx: LocalCtx;
  mw: MiddlewareFn<GlobalContext, LocalCtx>;
}

export function rateLimiter({
  limit,
}: {
  limit: { every: RlWindow };
}): SequentialMiddlewareRo<RateLimiterCtx> {
  const { rl } = createRateLimiter(limit.every);
  const mw = middlewareFn<GlobalContext, RateLimiterCtx>((req, _res) => {
    req.ctx.rl = rl; // we need to set the context here so it sticks
    if (!req.ctx.rl.canPass(getFingerprint({ req }))) {
      return middlewareResponse.error({
        status: 403,
        body: {
          code: "FORBIDDEN",
          message: `You're limited for the next ${req.ctx.rl.every}`,
        },
      });
    }
  });
  return {
    mw,
    ctx: { rl },
  };
}

interface AuthedContext {
  user: {
    email: string;
    name: string;
    role: "admin" | "visitor";
  } | null;
}

export function authed(): SequentialMiddlewareRo<AuthedContext> {
  const getUserSafe = (): AuthedContext["user"] | null => {
    if (Math.random() > 0.4) {
      return { email: "john@doe.com", name: "john", role: "admin" };
    } else return null;
  };

  const user = getUserSafe();
  const mw = middlewareFn<GlobalContext, AuthedContext>((req, _res) => {
    if (user)
      req.ctx.user = user; // we need to set the conext here too
    else {
      return middlewareResponse.error({
        body: {
          code: "UNAUTHORIZED",
          message: "Youre not authed!",
        },
      });
    }
  });
  return {
    mw,
    ctx: { user },
  };
}

/**
 * basically need to create a fucntion or const or whatver called use
 * middlewares.use(rateLimiter()).use(otherMiddleware()) etc...
 * where middlewares, is actually the one that calls createRouteMiddleware function finally & the only one, whith whatever the sum
 * or accumulation of all the other methods are, context included btw, meaning
 * if the rate limiter is using the RateLimiterCtx, we merge it, if we're using an auth middleware and we have authCtx, we merge it too
 * meaning we only actually use a combo of middlewareFn on top of each other & we infer the return types of
 * each function basically automatically
 * to finally be able to use a layered middleware approach to do stuff
 *
 *
 *
 * ```ts
 * basiclaly what im tryan say is, ince we return shit like this   return {
    mw,
    ctx: { user },
  }
 *```
 *  meaning the context is merged, in the ifnal fiuction & added basically there
 * so when we use use. soemthing it works
 * now the way to do it is to take whatver thing is attached to the ctx object return by any of the functions
 * the developer decied to create and we make a conetx out of it, & do typeof ctx & we add the rest and shit, so we dont really actualy
 * declare any type explciitily, like export type Merged, no sincethat's apain in tyeh ass, we just infer that shit
 * as much as the user wants to merge, and this is btw super performalnt it doesnt have t obe fucking type shenhiagns and shit
 * it's simple TS stuff, & actually this whole problem is simple TS stuff
 * that's asically the local conext we gonna pass to the createRouter Middleware and all
 * ```ts
 *  const final finalCtx = // all the previous ones and shit merged automatically
 *
 *  return createRouteMiddleware<Route, GlobalContext, typeof finalCtx>({
    route,
    middlewareFn: middlewareFn<GlobalContext, OurMergedCtx>((req, res) => {
      req.ctx = finalCtx;
     // here we just call whatever the fuck the return of te middlare functions form the
     // proceddures and shit we creted ealer
      mw(req,res); // drom authed or whaver, ofc we just call them one by one
      // basically we just see how many we got and wiich one is the first one and we all them all
      // but the trick is, we have to make sure if a fucntion of them returns, we rurn too and break here
      // becuae if we just clal the mlike this
        mw(req,res);
        mw(req,res);
        mw(req,res);
        mw(req,res);
      if any of these functions return some shit, we won't get it really so these need to all be called
      with returns, so if the 2nd one shortcuictus boom we return qiuck
      that's another probem that needs solving, idk if it's a problem since the sotuin is simple really
      just keep nest returning them that's it really,
       basically the midlware function the user creates the one that follows the sequantail middleware type returning
       we check the order, FIFO order, easy as, if use chose to .use(auth()) fist, we use that first then we forwared to the next
       for exmaple, the next one is the rate limiter right? aight we do it next then,

    }),
  });
 * ```
  and btw when it coms to calling the mw, we dont have to hard code them and shit;
  like it reviceves whatever from the fuctions that the user declared and shit
  so this has to work with anything really, as long as the user is adherering to the seuauential middlware
  inferce when declaing their middlewares functions, and the stuff becomes sooo simple since it's just a
  a matter of merging objcts and calling functions that's it, everything else is actually just ready right there

 *
 *
 * the way to uset he fucntion is sooo simpl
 * ```ts
 * export cont authedMiddleware = middlewares.use(authed()).use(rateLimiter({
  *    limit: {
  *     every: '10s'
  *   }
 *  })
 * ):
 * ```
 *and basically middlewars and shit under the hood calls
 * one note tho is ill provide u with the types from the ibrary it'self just so uk it's not weird
 * or exotic or crazy or whatvern so so uk the return types
 * but know that for sure, i only want u to send me this file and that's it
 * dont fucking chnage the library types and shit at all, the librayr itself shoul d not be touche at all
 * only thing u add or remove in this file alone, anything else is outside your shit
 * please dont fuckig touch this part
 * ```ts
 *
interface RateLimiterCtx {
  rl: RateLimiter;
}

export function rateLimiterMiddleware<Route extends ContractRoute>({
  route,
  limit,
}: {
  route: Route;
  limit: { every: RlWindow };
}) {
  const { rl } = createRateLimiter(limit.every);
  return createRouteMiddleware<Route, GlobalContext, RateLimiterCtx>({
    route,
    middlewareFn: middlewareFn<GlobalContext, RateLimiterCtx>((req, _res) => {
      req.ctx.rl = rl;
      if (!req.ctx.rl.canPass(getFingerprint({ req }))) {
        return middlewareResponse.error({
          status: 403,
          body: {
            code: "FORBIDDEN",
            message: `You're limited for the next ${req.ctx.rl.every}`,
          },
        });
      }
    }),
  });
}
  ```
*
* just know that tis fucntion is used somewher and do,fcnt fuckwith it, just do what i told u earler and stop fucking with me please
* this thing basically needs to work, i cannot afford it not working and shit tbh
* easy as, doin't use 'any' and dont fukcing create a ton of type shenanigasn, this is a very very verry siple fucking task
* if u need some functionality of merging use lodash and shit it's aleayd installed other tha nthat everything should be easy and nice
*
* your job is soo easy tbh, nothing major to it really

 */

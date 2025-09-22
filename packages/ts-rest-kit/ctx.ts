/**
 * GlobalTsrContext is the structural contract for per-request context that
 * the middleware chain and handlers rely on.
 *
 * You can extend it in your app:
 *
 *   import type { GlobalTsrContext } from "ts-rest-kit";
 *
 *   export interface GlobalContext extends GlobalTsrContext {
 *     ctx: {
 *       db: DatabaseClient;
 *     };
 *   }
 */
export interface GlobalTsrContext {
  ctx: object;
}

/**
 * Window shorthand. Examples: "100ms", "60s", "3h", "1d".
 * Units supported: ms, s, h, d.
 */
export type RlWindow =
  | `${number}ms`
  | `${number}s`
  | `${number}h`
  | `${number}d`;

/**
 * Result of an `allow` call.
 */
export interface AllowResult {
  /** True if permitted and state was updated. */
  allowed: boolean;
  /**
   * Whole tokens remaining.
   * For QuotaLimiter this is the integer token count left after the call.
   * For IntervalLimiter this is 0 or 1 and is usually ignored.
   */
  remaining: number;
  /** Milliseconds until you may try again. Zero if allowed. */
  retryAfterMs: number;
}

/**
 * Minimal KV so you can swap Memory for Redis later.
 * Store and return JSON strings. TTL is in milliseconds.
 */
export interface KvStore {
  /** Get a JSON string or null. Can be sync or async. */
  get(key: string): string | null | Promise<string | null>;
  /** Set a JSON string. Optional TTL in ms. */
  set(key: string, value: string, ttlMs?: number): void | Promise<void>;
}

/**
 * Default in-memory KV with TTL. Good for single instance apps and tests.
 */
class MemoryKvStore implements KvStore {
  private map = new Map<string, { v: string; exp?: number }>();

  public get(key: string): string | null {
    const hit = this.map.get(key);
    if (!hit) return null;
    if (hit.exp && Date.now() >= hit.exp) {
      this.map.delete(key);
      return null;
    }
    return hit.v;
  }

  public set(key: string, value: string, ttlMs?: number): void {
    const exp = ttlMs ? Date.now() + ttlMs : undefined;
    this.map.set(key, { v: value, exp });
  }
}

/**
 * Convert window string ("1500ms", "60s", "3h", "1d") to milliseconds.
 * Throws on invalid input.
 */
function windowMs(window: RlWindow): number {
  const m = /^(\d+)(ms|s|h|d)$/.exec(window);
  if (!m) throw new Error(`Invalid RlWindow value: ${window}`);
  const num = Number(m[1]);
  const unit = m[2] as "ms" | "s" | "h" | "d";
  if (num <= 0) throw new Error(`Invalid RlWindow value: ${window}`);
  switch (unit) {
    case "ms":
      return num;
    case "s":
      return num * 1000;
    case "h":
      return num * 60 * 60 * 1000;
    case "d":
      return num * 24 * 60 * 60 * 1000;
  }
}

/* --------------------------------------------------------------------------------
 * Interval limiter: enforces a minimum gap per key.
 * Use this for "at most once every X" semantics.
 * -------------------------------------------------------------------------------- */

interface IntervalLimiterApi {
  /**
   * Try to consume now.
   * Cost is accepted to keep a symmetric signature but is treated as 1.
   * For IntervalLimiter, `remaining` will be 0 or 1 and is usually ignored.
   */
  allow(id: string, cost?: number): Promise<AllowResult>;
  /** Change the interval at runtime. */
  update(interval: RlWindow): void;
  /** Read last successful timestamp for a key (ms). */
  getLast(id: string): number | undefined;
  /** Force-set last successful timestamp for a key (ms). */
  setLast(id: string, ts: number): void;
}

class IntervalLimiter implements IntervalLimiterApi {
  private interval: RlWindow;
  private last = new Map<string, number>(); // ms since epoch

  constructor(interval: RlWindow) {
    this.interval = interval;
  }

  public update(interval: RlWindow): void {
    this.interval = interval;
  }

  public async allow(id: string, cost = 1): Promise<AllowResult> {
    await Promise.resolve(); // keep async signature compatible with Quota
    if (cost !== 1) {
      // Interval limiter is binary. Cost is accepted but treated as 1.
    }
    const now = Date.now();
    const gap = windowMs(this.interval);
    const last = this.last.get(id) ?? 0;
    const elapsed = now - last;

    if (elapsed >= gap) {
      this.last.set(id, now);
      return { allowed: true, remaining: 0, retryAfterMs: 0 };
    }

    const retryAfterMs = gap - elapsed;
    return { allowed: false, remaining: 0, retryAfterMs };
  }

  public getLast(id: string): number | undefined {
    return this.last.get(id);
  }

  public setLast(id: string, ts: number): void {
    this.last.set(id, ts);
  }
}

/* --------------------------------------------------------------------------------
 * Quota limiter: token bucket. "limit per window" with optional bursts.
 * Tokens refill continuously based on elapsed time.
 * -------------------------------------------------------------------------------- */

interface QuotaLimiterApi {
  /**
   * Try to spend `cost` now.
   * Returns remaining whole tokens and retryAfterMs if blocked.
   */
  allow(id: string, cost?: number): Promise<AllowResult>;
  /** Inspect raw state for a key. */
  inspect(id: string): Promise<{ tokens: number; updatedAt: number } | null>;
  /** Force-set raw state for a key. */
  setRecord(id: string, tokens: number, updatedAt?: number): Promise<void>;
}

interface QuotaOptions {
  /** Average allowance: you can do up to `limit` per `window`. */
  limit: number;
  window: RlWindow;
  /** Optional burst capacity. Defaults to `limit`. */
  burst?: number;
  /** Optional KV backend for distributed enforcement. Defaults to in-memory. */
  store?: KvStore;
  /** Optional namespace for keys in KV. */
  keyPrefix?: string;
}

class QuotaLimiter implements QuotaLimiterApi {
  private readonly perMs: number;
  private readonly ratePerMs: number; // tokens added per ms
  private readonly capacity: number;
  private readonly store: KvStore;
  private readonly prefix: string;

  constructor(opts: QuotaOptions) {
    const per = windowMs(opts.window);
    this.perMs = per;
    this.ratePerMs = opts.limit / per;
    this.capacity = Math.max(1, opts.burst ?? opts.limit);
    this.store = opts.store ?? new MemoryKvStore();
    this.prefix = opts.keyPrefix ?? "rl:quota";
  }

  private k(id: string): string {
    return `${this.prefix}:${id}`;
  }

  public async allow(id: string, cost = 1): Promise<AllowResult> {
    const key = this.k(id);
    const raw = await Promise.resolve(this.store.get(key));
    const now = Date.now();

    let tokens: number;
    let updatedAt: number;

    if (raw) {
      const parsed = JSON.parse(raw) as { tokens: number; updatedAt: number };
      const elapsed = Math.max(0, now - parsed.updatedAt);
      const refilled = Math.min(
        this.capacity,
        parsed.tokens + elapsed * this.ratePerMs,
      );
      tokens = refilled;
      updatedAt = now;
    } else {
      tokens = this.capacity;
      updatedAt = now;
    }

    if (tokens >= cost) {
      tokens -= cost;
      await Promise.resolve(
        this.store.set(
          key,
          JSON.stringify({ tokens, updatedAt }),
          this.ttl(tokens),
        ),
      );
      return { allowed: true, remaining: Math.floor(tokens), retryAfterMs: 0 };
    }

    const deficit = cost - tokens;
    const retryAfterMs = Math.ceil(deficit / this.ratePerMs);
    await Promise.resolve(
      this.store.set(
        key,
        JSON.stringify({ tokens, updatedAt }),
        this.ttl(tokens),
      ),
    );
    return { allowed: false, remaining: Math.floor(tokens), retryAfterMs };
  }

  public async inspect(
    id: string,
  ): Promise<{ tokens: number; updatedAt: number } | null> {
    const raw = await Promise.resolve(this.store.get(this.k(id)));
    return raw
      ? (JSON.parse(raw) as { tokens: number; updatedAt: number })
      : null;
  }

  public async setRecord(
    id: string,
    tokens: number,
    updatedAt: number = Date.now(),
  ): Promise<void> {
    await Promise.resolve(
      this.store.set(
        this.k(id),
        JSON.stringify({ tokens, updatedAt }),
        this.ttl(tokens),
      ),
    );
  }

  /** Internal TTL helper. Keep keys around until they refill, capped at 1 day. */
  private ttl(currentTokens: number): number {
    const toFull = Math.ceil((this.capacity - currentTokens) / this.ratePerMs);
    return Math.min(86_400_000, toFull + 5_000);
  }
}

/* --------------------------------------------------------------------------------
 * Public factory: single function export
 * -------------------------------------------------------------------------------- */

/**
 * Common configuration for any limiter.
 */
interface BaseCfg {
  /** Optional KV backend for distributed enforcement such as Redis. Defaults to in-memory. */
  store?: KvStore;
  /** Optional namespace for KV keys. Useful when sharing a single backend between multiple limiters. */
  keyPrefix?: string;
}

/**
 * Interval limiter configuration.
 * Enforces a minimum gap between calls per key.
 *
 * Example: { kind: "interval", interval: "500ms" }
 */
export interface IntervalCfg extends BaseCfg {
  /** Selects the limiter type. */
  kind: "interval";
  /** Minimum time gap allowed between successful calls per key. */
  interval: RlWindow;
}

/**
 * Quota limiter configuration.
 * Implements a token bucket: limit per window with optional bursts.
 *
 * Example: { kind: "quota", limit: 100, window: "60s", burst: 200 }
 */
export interface QuotaCfg extends BaseCfg {
  /** Selects the limiter type. */
  kind: "quota";
  /** Maximum average allowance per window. Example: 100 requests per "60s". */
  limit: number;
  /** Time window string. Defines how often `limit` tokens are granted on average. */
  window: RlWindow;
  /** Optional burst capacity (bucket size). Defaults to `limit`. */
  burst?: number;
}

/**
 * Union of all supported limiter configurations.
 * Pass one of these objects to `createLimiter`.
 */
export type LimiterConfig = IntervalCfg | QuotaCfg;

export function createLimiter(config: QuotaCfg): QuotaLimiterApi;
export function createLimiter(config: IntervalCfg): IntervalLimiterApi;
/**
 * Create a limiter from a single config object.
 */
export function createLimiter(
  config: IntervalCfg | QuotaCfg,
): IntervalLimiterApi | QuotaLimiterApi {
  if (config.kind === "interval") {
    return new IntervalLimiter(config.interval);
  }
  const c = config;
  return new QuotaLimiter({
    limit: c.limit,
    window: c.window,
    burst: c.burst,
    store: c.store,
    keyPrefix: c.keyPrefix,
  });
}

/* --------------------------------------------------------------------------------
 * Docs and examples
 * -------------------------------------------------------------------------------- */

/**
 * WHAT IS "burst"?
 * - Quota limiter uses a token bucket.
 * - limit/window defines average rate. Example: limit 60 per "60s" means 1 token per second.
 * - burst is the bucket capacity. If burst is 120, caller can do up to 120 instantly when full.
 * - If burst is omitted, it defaults to limit which means no extra headroom beyond the average.
 *
 * WHAT IS "key" or "id"?
 * - Any string that identifies the caller or resource. Examples:
 *   - "ip:203.0.113.9"
 *   - "user:123"
 *   - "route:POST:/api/login:user:123"
 * - You choose the granularity. One limiter instance can serve many keys.
 *
 * About fingerprints
 * - You can derive a stable id for anonymous requests using your own `keyFromRequest(req)`.
 * - This library does not export a fingerprint helper to avoid coupling.
 */

/**
 * Example 1: Interval limiter for login attempts (one call per 500ms per user)
 *
 * ```ts
 * import { createLimiter } from "@ashgw/rate-limiter";
 *
 * const loginInterval = createLimiter({ kind: "interval", interval: "500ms" });
 *
 * export async function loginHandler(req: Request) {
 *   const userId = "user:" + getUserId(req); // your own resolver
 *   const r = await loginInterval.allow(userId);
 *   if (!r.allowed) {
 *     return new Response("Too many attempts. Retry in " + r.retryAfterMs + "ms", {
 *       status: 429,
 *       headers: { "Retry-After": String(Math.ceil(r.retryAfterMs / 1000)) },
 *     });
 *   }
 *   // proceed with login...
 * }
 * ```
 */

/**
 * Example 2: Quota limiter for API requests 100 requests per minute per user
 *
 * ```ts
 * import { createLimiter } from "@ashgw/rate-limiter";
 *
 * const apiQuota = createLimiter({
 *   kind: "quota",
 *   limit: 100,
 *   window: "60s",
 *   burst: 100, // allow short spikes up to 100 at once when bucket is full
 * });
 *
 * export async function apiHandler(req: Request) {
 *   const userId = req.user ? "user:" + req.user.id : "ip:" + req.ip;
 *   const r = await apiQuota.allow(userId, 1);
 *   if (!r.allowed) {
 *     return new Response("Rate limit. Retry in " + r.retryAfterMs + "ms", {
 *       status: 429,
 *       headers: { "Retry-After": String(Math.ceil(r.retryAfterMs / 1000)) },
 *     });
 *   }
 *   // handle request...
 * }
 * ```
 */

/**
 * Example 3: Anonymous keys with your own fingerprint
 *
 * ```ts
 * // derive a stable key for callers without auth
 * const id = req.user ? "user:" + req.user.id : "ip:" + req.ip;
 * // or your own `keyFromRequest(req)` implementation
 * ```
 */

/**
 * Example 4: Express style middleware with Quota limiter
 *
 * ```ts
 * import type { Request, Response, NextFunction } from "express";
 * import { createLimiter } from "@ashgw/rate-limiter";
 *
 * const quota = createLimiter({ kind: "quota", limit: 300, window: "60s", burst: 300 });
 *
 * export async function rl(req: Request, res: Response, next: NextFunction) {
 *   const id = (req as any).user ? "user:" + (req as any).user.id : "ip:" + req.ip;
 *   const r = await quota.allow(id);
 *   if (!r.allowed) {
 *     res.setHeader("Retry-After", String(Math.ceil(r.retryAfterMs / 1000)));
 *     return res.status(429).send("Too many requests");
 *   }
 *   return next();
 * }
 * ```
 */

/**
 * Example 5: Inspecting and overriding Quota state admin ops or tests
 *
 * ```ts
 * const q = createLimiter({ kind: "quota", limit: 10, window: "10s" });
 *
 * // Inspect current bucket
 * const s = await q.inspect("user:123"); // { tokens, updatedAt } | null
 *
 * // Refill or drain manually
 * await q.setRecord("user:123", 10); // full bucket
 * await q.setRecord("user:123", 0);  // empty bucket
 * ```
 */

/**
 * Example 6: Redis adapter KvStore sketch
 *
 * ```ts
 * import { Redis } from "ioredis";
 * const redis = new Redis(process.env.REDIS_URL!);
 *
 * class RedisKv implements KvStore {
 *   async get(key: string): Promise<string | null> {
 *     return await redis.get(key);
 *   }
 *   async set(key: string, value: string, ttlMs?: number): Promise<void> {
 *     if (ttlMs && ttlMs > 0) {
 *       await redis.set(key, value, "PX", ttlMs);
 *     } else {
 *       await redis.set(key, value);
 *     }
 *   }
 * }
 *
 * const q = createLimiter({
 *   kind: "quota",
 *   limit: 1000,
 *   window: "60s",
 *   burst: 1000,
 *   store: new RedisKv(),
 *   keyPrefix: "rl:api",
 * });
 * ```
 */

/**
 * ### TOFIX
 * TTL: you cap TTL at 1 day. That’s fine, but edge case: if someone sets a huge window (30d), your keys might get evicted early. Maybe document that.
 *
 * Cost param in interval limiter: right now it’s ignored => drop it
 *
 * Concurrency race: in-memory is fine, but in Redis with multiple processes, you can get race conditions (two clients read same bucket before update). If you want bulletproof Redis use, you’d need atomic ops (like INCRBY with TTL). But I think you’re consciously not solving this right now, and that’s fine. -> so do it
 *
 */

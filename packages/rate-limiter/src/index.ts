// src/index.ts
import { getFingerprint } from "./getFingerprint";

/**
 * Window shorthand used by all limiters.
 * Examples: "100ms", "1s", "2h", "3d".
 */
export type RlWindow =
  | `${number}ms`
  | `${number}s`
  | `${number}h`
  | `${number}d`;

/**
 * Simple pacing limiter. Enforces exactly 1 successful call per window per key.
 *
 * Use this when you want strict spacing between requests rather than bursts.
 *
 * Typical usage:
 * ```ts
 * const rl = new RateLimiterService("100ms");
 * if (!rl.canPass(userKey)) throw tooManyRequests();
 * ```
 *
 * Complexity: O(1) per call, in-memory by default.
 */
export class RateLimiterService {
  /** Window length, such as "100ms" or "1s" */
  public every: RlWindow;

  /** Last successful request timestamp per key (ms since epoch) */
  private lastCalled = new Map<string, number>();

  /** Optional counter per key for fixed-window style bookkeeping */
  private counts = new Map<string, number>();

  /**
   * Create a pacing limiter that allows 1 call per `every` window per key.
   * @param every String window like "100ms", "1s", "2h".
   */
  constructor(every: RlWindow) {
    this.every = every;
  }

  /**
   * Change the pacing window at runtime.
   * Safe to call live. Takes effect on the next `canPass`.
   */
  public updateWindow(newWindow: RlWindow): void {
    this.every = newWindow;
  }

  /**
   * Consume a pacing slot for `key` if enough time has elapsed.
   * @returns true if allowed and the timestamp was updated. false if blocked.
   */
  public canPass(key: string): boolean {
    const now = Date.now();
    const last = this.lastCalled.get(key) ?? 0;

    if (now - last < this.parseWindow(this.every)) {
      return false;
    }

    this.lastCalled.set(key, now);
    return true;
  }

  /**
   * Get the last successful request timestamp for `key` (ms since epoch).
   * Undefined means the key has never been allowed.
   */
  public get(key: string): number | undefined {
    return this.lastCalled.get(key);
  }

  /**
   * Force-set the last successful request timestamp for `key`.
   * Use for migrations, backfills, or syncing with an external store.
   */
  public set(key: string, value: number): void {
    this.lastCalled.set(key, value);
  }

  /**
   * Get the current fixed-window count for `key`.
   * Only relevant if you are tracking counters via `setCount` or `setState`.
   */
  public getCount(key: string): number | undefined {
    return this.counts.get(key);
  }

  /**
   * Set the current fixed-window count for `key`.
   * Useful when you implement a naive counter-based limiter externally but want a shared API surface.
   */
  public setCount(key: string, count: number): void {
    this.counts.set(key, count);
  }

  /**
   * Get combined state if you use counter-plus-timestamp semantics.
   * Returns `{ count, lastRequest }` or `undefined` if never seen.
   */
  public getState(
    key: string,
  ): { count: number; lastRequest: number } | undefined {
    const lastRequest = this.lastCalled.get(key);
    if (lastRequest === undefined) return undefined;
    return { count: this.counts.get(key) ?? 0, lastRequest };
  }

  /**
   * Set combined state for a key. Use if you maintain a fixed-window counter outside
   * and want to keep the pacer in sync.
   */
  public setState(key: string, count: number, lastRequest: number): void {
    this.counts.set(key, count);
    this.lastCalled.set(key, lastRequest);
  }

  /**
   * Async getter for last timestamp. Mirrors `get` for future KV backends.
   * In-memory version resolves immediately.
   */
  public async getAsync(key: string): Promise<number | undefined> {
    await Promise.resolve();
    return this.get(key);
  }

  /**
   * Async setter overloads. Mirrors `set` and `setState` for future KV backends.
   *
   * Overload A: `setAsync(key, timestampMs)`
   * Overload B: `setAsync(key, count, lastRequestMs)`
   */
  public async setAsync(key: string, value: number): Promise<void>;
  public async setAsync(
    key: string,
    count: number,
    lastRequest: number,
  ): Promise<void>;
  public async setAsync(key: string, a: number, b?: number): Promise<void> {
    await Promise.resolve();
    if (typeof b === "number") {
      // setAsync(key, count, lastRequest)
      this.setState(key, a, b);
    } else {
      // setAsync(key, timestamp)
      this.set(key, a);
    }
  }

  /**
   * Stable fingerprint you can use as a rate limit key for anonymous callers.
   * Includes salted IP hash, UA, and language.
   */
  public fp({ req }: { req: Request }): string {
    return getFingerprint({ req });
  }

  /**
   * Convert a window like "1500ms" or "2s" to seconds, rounding down.
   * Useful for HTTP Retry-After headers when you only have seconds.
   */
  public windowToSeconds(window: RlWindow): number {
    return Math.floor(this.parseWindow(window) / 1000);
  }

  /**
   * Parse a window string into milliseconds.
   * Throws on invalid input or non-positive values.
   */
  public parseWindow(window: RlWindow): number {
    const m = /^(\d+)(ms|s|h|d)$/.exec(window);
    if (!m) {
      throw new Error(`Invalid RlWindow value: ${window}`);
    }

    const num = Number(m[1]);
    const unit = m[2] as "ms" | "s" | "h" | "d";

    if (num <= 0) {
      throw new Error(`Invalid RlWindow value: ${window}`);
    }

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
}

/**
 * Minimal KV interface so you can swap Memory for Redis later.
 * Keep values as JSON strings for portability and atomic updates via Lua if using Redis.
 */
export interface KvStore {
  /** Get a JSON string or null for a key. Can be sync or async. */
  get(key: string): string | null | Promise<string | null>;
  /**
   * Set a JSON string value. Optional TTL in milliseconds for cleanup.
   * Implement TTL in the backend if possible. Memory store simulates TTL.
   */
  set(key: string, value: string, ttlMs?: number): void | Promise<void>;
}

/**
 * Default in-memory KV with TTL. Good for single-instance apps and tests.
 * Not distributed. Replace with a Redis-backed KvStore for production clusters.
 */
export class MemoryKvStore implements KvStore {
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

/** Average rate shape for token bucket limiters. */
export interface Rate {
  /** Tokens added per window, for example 10 */
  tokens: number;
  /** Window length, for example "1s" */
  per: RlWindow;
}

/**
 * Options for the token bucket limiter.
 * - `burst` is the capacity. If unset, equals `rate.tokens`.
 * - `store` lets you plug in Redis for distributed enforcement.
 * - `keyPrefix` namespaces keys in the KV.
 */
export interface TokenBucketOptions {
  rate: Rate;
  burst?: number;
  store?: KvStore;
  keyPrefix?: string;
}

/** Result of an `allow` call on the token bucket limiter. */
export interface AllowResult {
  /** True if allowed and tokens were consumed */
  allowed: boolean;
  /** Whole tokens remaining after this attempt (floored) */
  remaining: number;
  /** Milliseconds until enough tokens are available if blocked. Zero if allowed. */
  retryAfterMs: number;
}

/**
 * Token bucket limiter. Implements "N requests per T" with configurable bursts.
 *
 * Use this when you want controlled throughput and short bursts.
 *
 * Typical usage:
 * ```ts
 * const rl = new TokenBucketLimiter({ rate: { tokens: 10, per: "1s" }, burst: 10 });
 * const res = await rl.allow(userKey);
 * if (!res.allowed) {
 *   setHeader("Retry-After", String(retryAfterSeconds(res.retryAfterMs)));
 *   throw tooManyRequests();
 * }
 * ```
 *
 * Behavior
 * - Refill is continuous based on elapsed time, not discrete windows.
 * - Capacity is the maximum tokens available at any time. It caps burst size.
 * - State is persisted in `store` as JSON, one record per key.
 */
export class TokenBucketLimiter {
  private readonly perMs: number;
  private readonly refillPerMs: number;
  private readonly capacity: number;
  private readonly store: KvStore;
  private readonly prefix: string;

  /**
   * Create a token bucket limiter.
   * @param opts.rate Average fill rate, such as 10 per "1s".
   * @param opts.burst Capacity. Default equals `rate.tokens`.
   * @param opts.store KV backend. Defaults to in-memory.
   * @param opts.keyPrefix Namespace for KV keys. Defaults to "rl:tb".
   */
  constructor(opts: TokenBucketOptions) {
    // reuse parser without exposing internals
    const parser = new RateLimiterService("1s");
    this.perMs = parser.parseWindow(opts.rate.per);
    this.refillPerMs = opts.rate.tokens / this.perMs; // tokens per ms
    this.capacity = Math.max(1, opts.burst ?? opts.rate.tokens);
    this.store = opts.store ?? new MemoryKvStore();
    this.prefix = opts.keyPrefix ?? "rl:tb";
  }

  private key(id: string): string {
    return `${this.prefix}:${id}`;
  }

  /**
   * Try to spend `cost` tokens for `id`.
   * @param id Rate limit key, for example user id or IP fingerprint.
   * @param cost Tokens to spend. Defaults to 1.
   * @returns AllowResult with `allowed`, `remaining`, and `retryAfterMs`.
   */
  public async allow(id: string, cost = 1): Promise<AllowResult> {
    const key = this.key(id);
    const raw = await Promise.resolve(this.store.get(key));
    const now = Date.now();

    let tokens: number;
    let updatedAt: number;

    if (raw) {
      const parsed = JSON.parse(raw) as { tokens: number; updatedAt: number };
      const elapsed = Math.max(0, now - parsed.updatedAt);
      const refilled = Math.min(
        this.capacity,
        parsed.tokens + elapsed * this.refillPerMs,
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
    const retryAfterMs = Math.ceil(deficit / this.refillPerMs);
    await Promise.resolve(
      this.store.set(
        key,
        JSON.stringify({ tokens, updatedAt }),
        this.ttl(tokens),
      ),
    );
    return { allowed: false, remaining: Math.floor(tokens), retryAfterMs };
  }

  /** Internal TTL helper. Keeps keys around until they refill, capped at 1 day. */
  private ttl(currentTokens: number): number {
    const toFull = Math.ceil(
      (this.capacity - currentTokens) / this.refillPerMs,
    );
    return Math.min(86_400_000, toFull + 5_000);
  }
}

/**
 * Overloaded factory that returns the right class based on `mode`.
 *
 * Mode "pace" returns `RateLimiterService`.
 * Mode "bucket" returns `TokenBucketLimiter`.
 *
 * Examples:
 * ```ts
 * const pace = createRateLimiter({ mode: "pace", every: "100ms" });
 * const bucket = createRateLimiter({ mode: "bucket", rate: { tokens: 10, per: "1s" }, burst: 10 });
 * ```
 */
export function createRateLimiter(opts: {
  mode: "pace";
  every: RlWindow;
}): RateLimiterService;
export function createRateLimiter(opts: {
  mode: "bucket";
  rate: Rate;
  burst?: number;
  store?: KvStore;
  keyPrefix?: string;
}): TokenBucketLimiter;
export function createRateLimiter(
  opts:
    | { mode: "pace"; every: RlWindow }
    | {
        mode: "bucket";
        rate: Rate;
        burst?: number;
        store?: KvStore;
        keyPrefix?: string;
      },
): RateLimiterService | TokenBucketLimiter {
  return opts.mode === "pace"
    ? new RateLimiterService((opts as { every: RlWindow }).every)
    : new TokenBucketLimiter(
        opts as {
          rate: Rate;
          burst?: number;
          store?: KvStore;
          keyPrefix?: string;
        },
      );
}

/**
 * Convert milliseconds to Retry-After seconds for HTTP responses.
 * Always rounds up to the next full second as required by the header spec.
 */
export function retryAfterSeconds(ms: number): number {
  return Math.ceil(ms / 1000);
}

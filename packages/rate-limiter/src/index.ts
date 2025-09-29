/* =============================================================================
 * rl-limiter
 * Two modes:
 *  - Interval: at most once every <window> per key
 *  - Quota: token bucket with limit/window and optional burst
 * Windows: "<number>ms" | "<number>s" | "<number>h" | "<number>d"
 * Zero dependencies. Optional distributed safety via mutex hooks.
 * ============================================================================= */

export type RlWindow =
  | `${number}ms`
  | `${number}s`
  | `${number}h`
  | `${number}d`;

export interface AllowResult {
  allowed: boolean;
  /** Whole tokens remaining for quota. For interval, 0 or 1. */
  remaining: number;
  /** Milliseconds until you may try again. Zero if allowed. */
  retryAfterMs: number;
}

/** Minimal KV interface. Values are JSON strings. TTL is milliseconds. */
export interface KvStore {
  get(key: string): string | null | Promise<string | null>;
  set(key: string, value: string, ttlMs?: number): void | Promise<void>;
}

/**
 * Optional distributed mutex interface.
 * If provided, quota updates are serialized safely across processes.
 * Implementation must return a unique token from tryLock and only unlock if token matches.
 */
export interface MutexKvStore extends KvStore {
  tryLock(key: string, ttlMs: number): string | null | Promise<string | null>;
  unlock(key: string, token: string): void | Promise<void>;
}

/** Type guard for mutex support. */
function hasMutex(store: KvStore): store is MutexKvStore {
  return (
    typeof (store as Partial<MutexKvStore>).tryLock === "function" &&
    typeof (store as Partial<MutexKvStore>).unlock === "function"
  );
}

/** Default in-memory KV with TTL and an in-process mutex. */
export class MemoryKvStore implements MutexKvStore {
  private map = new Map<string, { v: string; exp?: number }>();
  private locks = new Map<string, { token: string; exp: number }>();

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

  public tryLock(key: string, ttlMs: number): string | null {
    const now = Date.now();
    const lock = this.locks.get(key);
    if (lock && lock.exp > now) return null;
    const token = Math.random().toString(36).slice(2);
    this.locks.set(key, { token, exp: now + Math.max(25, ttlMs) });
    return token;
  }

  public unlock(key: string, token: string): void {
    const lock = this.locks.get(key);
    if (!lock) return;
    if (lock.token === token) this.locks.delete(key);
  }
}

/** Convert window string to milliseconds. Throws on invalid input. */
function windowMs(window: RlWindow): number {
  const m = /^(\d+)(ms|s|h|d)$/.exec(window);
  if (!m) throw new Error(`Invalid RlWindow: ${window}`);
  const num = Number(m[1]);
  if (!Number.isFinite(num) || num <= 0)
    throw new Error(`Invalid RlWindow: ${window}`);
  const unit = m[2] as "ms" | "s" | "h" | "d";
  if (unit === "ms") return num;
  if (unit === "s") return num * 1_000;
  if (unit === "h") return num * 3_600_000;
  return num * 86_400_000;
}

/* -----------------------------------------------------------------------------
 * Interval limiter: "at most once every X" per key
 * ---------------------------------------------------------------------------- */

export interface IntervalLimiterApi {
  allow(id: string): Promise<AllowResult>;
  update(interval: RlWindow): void;
  getLast(id: string): number | undefined;
  setLast(id: string, ts: number): void;
}

class IntervalLimiter implements IntervalLimiterApi {
  private interval: RlWindow;
  private last = new Map<string, number>(); // ms epoch

  constructor(interval: RlWindow) {
    this.interval = interval;
  }

  public update(interval: RlWindow): void {
    this.interval = interval;
  }

  public async allow(id: string): Promise<AllowResult> {
    // keep async signature for symmetry and future adapters
    await Promise.resolve();
    const now = Date.now();
    const gap = windowMs(this.interval);
    const last = this.last.get(id) ?? 0;
    const elapsed = now - last;

    if (elapsed >= gap) {
      this.last.set(id, now);
      return { allowed: true, remaining: 1, retryAfterMs: 0 };
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

/* -----------------------------------------------------------------------------
 * Quota limiter: token bucket (limit per window, optional burst)
 * ---------------------------------------------------------------------------- */

export interface QuotaLimiterApi {
  allow(id: string, cost?: number): Promise<AllowResult>;
  inspect(id: string): Promise<{ tokens: number; updatedAt: number } | null>;
  setRecord(id: string, tokens: number, updatedAt?: number): Promise<void>;
}

export interface QuotaOptions {
  limit: number;
  window: RlWindow;
  burst?: number;
  store?: KvStore;
  keyPrefix?: string;
  /** Optional: lock TTL while updating a key, only used when store supports mutex. */
  lockTtlMs?: number;
  /** Optional small delay between lock retries. Defaults 8 ms. */
  lockRetryDelayMs?: number;
  /** Optional retry attempts for acquiring lock. Defaults 3. */
  lockRetries?: number;
}

class QuotaLimiter implements QuotaLimiterApi {
  private readonly perMs: number;
  private readonly ratePerMs: number;
  private readonly capacity: number;
  private readonly store: KvStore;
  private readonly prefix: string;
  private readonly lockTtlMs: number;
  private readonly lockRetries: number;
  private readonly lockDelay: number;

  constructor(opts: QuotaOptions) {
    if (!Number.isFinite(opts.limit) || opts.limit <= 0) {
      throw new Error("Quota 'limit' must be a positive number");
    }
    const per = windowMs(opts.window);
    this.perMs = per;
    this.ratePerMs = opts.limit / per;
    this.capacity = Math.max(1, opts.burst ?? opts.limit);
    this.store = opts.store ?? new MemoryKvStore();
    this.prefix = opts.keyPrefix ?? "rl:quota";
    this.lockTtlMs = Math.max(50, opts.lockTtlMs ?? 500);
    this.lockRetries = Math.max(0, opts.lockRetries ?? 3);
    this.lockDelay = Math.max(0, opts.lockRetryDelayMs ?? 8);
  }

  private k(id: string): string {
    return `${this.prefix}:${id}`;
  }
  private lk(id: string): string {
    return `${this.prefix}:lock:${id}`;
  }

  public async allow(id: string, cost = 1): Promise<AllowResult> {
    if (!Number.isFinite(cost) || cost <= 0) {
      throw new Error("cost must be a positive number");
    }
    const now = Date.now();
    const doUpdate = async () => {
      const key = this.k(id);
      const raw = await Promise.resolve(this.store.get(key));
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
        return {
          allowed: true,
          remaining: Math.floor(tokens),
          retryAfterMs: 0,
        };
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
    };

    if (hasMutex(this.store)) {
      const lockKey = this.lk(id);
      let token: string | null = null;

      for (let i = 0; i <= this.lockRetries; i++) {
        token = await Promise.resolve(
          this.store.tryLock(lockKey, this.lockTtlMs),
        );
        if (token) break;
        if (i < this.lockRetries) await sleep(this.lockDelay);
      }

      if (token) {
        try {
          return await doUpdate();
        } finally {
          await Promise.resolve(this.store.unlock(lockKey, token));
        }
      }
      // If we fail to lock, fall back to best-effort. Still safe in single-instance scenarios.
      return await doUpdate();
    }

    // No mutex available, do best-effort update. Safe for single instance memory.
    return await doUpdate();
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

  /** TTL until full plus a small buffer. No hard cap to avoid early eviction on huge windows. */
  private ttl(currentTokens: number): number {
    const toFull = Math.ceil((this.capacity - currentTokens) / this.ratePerMs);
    return Math.max(1000, toFull + 5000);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/* -----------------------------------------------------------------------------
 * Public factory
 * ---------------------------------------------------------------------------- */

export interface BaseCfg {
  store?: KvStore;
  keyPrefix?: string;
}

export interface IntervalCfg extends BaseCfg {
  kind: "interval";
  interval: RlWindow;
}

export interface QuotaCfg extends BaseCfg {
  kind: "quota";
  limit: number;
  window: RlWindow;
  burst?: number;
  lockTtlMs?: number;
  lockRetryDelayMs?: number;
  lockRetries?: number;
}

export type LimiterConfig = IntervalCfg | QuotaCfg;

export function createLimiter(config: QuotaCfg): QuotaLimiterApi;
export function createLimiter(config: IntervalCfg): IntervalLimiterApi;
export function createLimiter(
  config: LimiterConfig,
): IntervalLimiterApi | QuotaLimiterApi {
  if (config.kind === "interval") {
    return new IntervalLimiter(config.interval);
  }
  return new QuotaLimiter({
    limit: config.limit,
    window: config.window,
    burst: config.burst,
    store: config.store,
    keyPrefix: config.keyPrefix,
    lockTtlMs: config.lockTtlMs,
    lockRetryDelayMs: config.lockRetryDelayMs,
    lockRetries: config.lockRetries,
  });
}

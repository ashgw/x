# limico

A zero-dependency rate limiter with elite DX. Two simple modes:

- Interval: at most once every window per key
- Quota: token bucket, limit per window with optional burst

Windows are human strings: `"100ms"`, `"60s"`, `"3h"`, `"1d"`. Works in Node, Bun, Deno, browser. Single instance by default. If you need distributed safety on Redis, implement two tiny mutex methods and you’re done.

## Why

Early-stage stacks are simple: one API, one Redis or just memory. You want clean ergonomics, not a lecture on queuing theory. Pick interval or quota, pass readable windows, ship.

## Quick start

```ts
import { createLimiter } from "rl-limiter";

// 1) Interval: at most once every 500ms per key
const loginInterval = createLimiter({ kind: "interval", interval: "500ms" });

export async function login(req: Request) {
  const id = "user:" + getUserId(req);
  const r = await loginInterval.allow(id);
  if (!r.allowed) {
    return tooMany(r.retryAfterMs);
  }
  // continue...
}

// 2) Quota: 100 requests per 60s, burst up to 100
const apiQuota = createLimiter({
  kind: "quota",
  limit: 100,
  window: "60s",
  burst: 100,
});

export async function api(req: Request) {
  const id = req.user ? "user:" + req.user.id : "ip:" + req.ip;
  const r = await apiQuota.allow(id, 1);
  if (!r.allowed) return tooMany(r.retryAfterMs);
  // handle...
}
```

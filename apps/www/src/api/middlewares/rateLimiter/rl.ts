import type { RlWindow } from "./window";
import { parseWindow } from "./window";

export interface RateLimiter {
  canPass: (key: string) => boolean;
  every: RlWindow;
}

export function createRateLimiter(every: RlWindow): { rl: RateLimiter } {
  const lastCalled = new Map<string, number>();

  const limiter = {
    canPass: (key: string) => {
      const now = Date.now();
      const last = lastCalled.get(key) ?? 0;

      if (now - last < parseWindow(every)) {
        return false; // too soon
      }

      lastCalled.set(key, now);
      return true;
    },
    every,
  } satisfies RateLimiter;

  return { rl: limiter };
}

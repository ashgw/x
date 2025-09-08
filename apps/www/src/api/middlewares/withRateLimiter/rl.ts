export interface RateLimiter {
  check: (key: string) => boolean;
}

export function createRateLimiter(intervalMs = 2000): { rl: RateLimiter } {
  const lastCalled = new Map<string, number>();
  const rl: RateLimiter = {
    check: (key: string) => {
      const now = Date.now();
      const last = lastCalled.get(key) ?? 0;

      if (now - last < intervalMs) {
        return false; // too soon
      }
      lastCalled.set(key, now);
      return true;
    },
  };

  return { rl };
}

export const { rl } = createRateLimiter(2000);

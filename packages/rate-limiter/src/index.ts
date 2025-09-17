import { getFingerprint } from "./getFingerprint";

export type RlWindow = `${number}s` | `${number}h` | `${number}d`;

export class RateLimiterService {
  public every: RlWindow;
  private lastCalled = new Map<string, number>();

  constructor(every: RlWindow) {
    this.every = every;
  }

  public updateWindow(newWindow: RlWindow): void {
    this.every = newWindow;
  }
  public canPass(key: string): boolean {
    const now = Date.now();
    const last = this.lastCalled.get(key) ?? 0;

    if (now - last < this.parseWindow(this.every)) {
      return false; // too soon
    }

    this.lastCalled.set(key, now);
    return true;
  }

  public fp({ req }: { req: Request }): string {
    return getFingerprint({ req });
  }

  public windowToSeconds(window: RlWindow): number {
    return Math.floor(this.parseWindow(window) / 1000);
  }

  public parseWindow(window: RlWindow): number {
    const m = /^(\d+)([shd])$/.exec(window);
    if (!m) {
      throw new Error(`Invalid RlWindow value: ${window}`);
    }

    const num = Number(m[1]);
    const unit = m[2] as "s" | "h" | "d";

    if (num <= 0) {
      throw new Error(`Invalid RlWindow value: ${window}`);
    }

    switch (unit) {
      case "s":
        return num * 1000;
      case "h":
        return num * 60 * 60 * 1000;
      case "d":
        return num * 24 * 60 * 60 * 1000;
    }
  }
}

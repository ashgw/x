export type RlWindow = `${number}s` | `${number}h` | `${number}d`;

export function parseWindow(window: RlWindow): number {
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

/**
 * Example: "10s" -> 10, "1h" -> 3600, "2d" -> 172800
 */
export function windowToSeconds(window: RlWindow): number {
  return Math.floor(parseWindow(window) / 1000);
}

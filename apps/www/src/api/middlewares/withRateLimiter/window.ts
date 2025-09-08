export type RlWindow = `${number}s` | `${number}h` | `${number}d`;

export function parseWindow(window: RlWindow): number {
  const unit = window.slice(-1) as "s" | "h" | "d";
  const num = parseInt(window.slice(0, -1), 10);

  if (Number.isNaN(num) || num <= 0) {
    throw new Error(`Invalid RlWindow value: ${window}`);
  }

  if (unit === "s") return num * 1000;
  if (unit === "h") return num * 60 * 60 * 1000;
  // must be "d"
  return num * 24 * 60 * 60 * 1000;
}

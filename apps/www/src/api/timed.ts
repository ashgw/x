import { logger } from "@ashgw/observability";

export async function timed<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<T> {
  const t0 = Date.now();
  try {
    return await fn();
  } finally {
    const dt = Date.now() - t0;
    logger.info(`[REST] ${label} took ${dt}ms`);
  }
}

export async function timed<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<T> {
  const t0 = Date.now();
  try {
    return await fn();
  } finally {
    const dt = Date.now() - t0;
    // eslint-disable-next-line no-restricted-syntax
    console.debug(`[REST] ${label} took ${dt}ms`);
  }
}

export function repoMainBranchBaseUrl(opts: {
  repo: string;
  scriptPath: string;
}) {
  const { repo, scriptPath } = opts;
  return `https://raw.githubusercontent.com/ashgw/${repo}/main/${scriptPath}`;
}

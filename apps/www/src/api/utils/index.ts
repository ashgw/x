export function repoMainBranchBaseUrl(opts: {
  repo: string;
  scriptPath: string;
}) {
  const { repo, scriptPath } = opts;
  return `https://raw.githubusercontent.com/ashgw/${repo}/main/${scriptPath}`;
}

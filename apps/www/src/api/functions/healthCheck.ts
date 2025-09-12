import type { HealthCheckResponses } from "~/api/models";

export async function healthCheck(): Promise<HealthCheckResponses> {
  await new Promise((r) => setTimeout(r, 1));

  return {
    status: 200,
    body: undefined,
  };
}

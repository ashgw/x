import type { HealthResponses } from "~/api/models";

export async function healthCheck(): Promise<HealthResponses> {
  await new Promise((r) => setTimeout(r, 1));

  return {
    status: 200,
    body: undefined,
  };
}

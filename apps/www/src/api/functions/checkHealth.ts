import type { CheckHealthResponses } from "../schemas/responses";

export async function checkHealth(): Promise<CheckHealthResponses> {
  await new Promise((r) => setTimeout(r, 1));
  return {
    status: 200,
  };
}

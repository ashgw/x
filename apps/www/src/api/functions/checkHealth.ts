import type { CheckHealthResponses } from "../models/ros";

export async function checkHealth(): Promise<CheckHealthResponses> {
  await new Promise((r) => setTimeout(r, 1));
  return {
    status: 200,
    body: {
      ping: "pong",
    },
  };
}

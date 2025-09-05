import type { CheckHealthRos } from "../models/ros";

export async function checkHealth(): Promise<CheckHealthRos> {
  await new Promise((r) => setTimeout(r, 1));
  return {
    status: 200,
    body: {
      ping: "pong",
    },
  };
}

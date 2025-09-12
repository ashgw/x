import type { HealthCheckResponses } from "~/api/models";

// TODO: make it so that when we create this response
// we dont have to return body: undefined, just omit it completely
// this will be in inference options, the handler will get body: undefined
// but we won't, we will only return { status: 200 }
export async function healthCheck(): Promise<HealthCheckResponses> {
  await new Promise((r) => setTimeout(r, 1));

  return {
    status: 200,
    body: undefined,
  };
}

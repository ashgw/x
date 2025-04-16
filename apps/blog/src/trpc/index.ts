import { trpcClient } from "./client";
import { trpcServer } from "./server";

export const trpc = {
  client: trpcClient,
  server: trpcServer,
};

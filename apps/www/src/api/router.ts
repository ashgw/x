import { tsr } from "@ts-rest/serverless/fetch";
import { v1Contract } from "~/api/contract";
import { controller } from "~/api/controllers";

export const router = tsr.router(v1Contract, {
  bootstrap: async ({ query }) => controller.bootstrap({ query }),
  gpg: async ({ query }) => controller.gpg({ query }),
  debion: async ({ query }) => controller.debion({ query }),
  whisper: async ({ query }) => controller.whisper({ query }),
  healthCheck: async () => controller.healthCheck(),
});

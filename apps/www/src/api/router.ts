import { tsr } from "@ts-rest/serverless/fetch";
import { v1Contract } from "~/api/contract";
import { controllers } from "~/api/controllers";

export const router = tsr.router(v1Contract, {
  bootstrap: async ({ query }) => controllers.bootstrap({ query }),
  gpg: async ({ query }) => controllers.gpg({ query }),
  debion: async ({ query }) => controllers.debion({ query }),
  whisper: async ({ query }) => controllers.whisper({ query }),
  healthCheck: async () => controllers.healthCheck(),
});

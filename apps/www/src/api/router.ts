import { tsr } from "@ts-rest/serverless/fetch";
import { v1Contract } from "~/api/contract";
import { Controllers } from "~/api/controllers";

export const router = tsr.router(v1Contract, {
  bootstrap: async ({ query }) => Controllers.bootstrap({ query }),
  gpg: async ({ query }) => Controllers.gpg({ query }),
  debion: async ({ query }) => Controllers.debion({ query }),
  whisper: async ({ query }) => Controllers.whisper({ query }),
  myPost: async ({ body }) => Controllers.myPost({ body }),
});

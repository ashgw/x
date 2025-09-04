import { tsr } from "@ts-rest/serverless/fetch";
import { v1Contract } from "~/api/contract";
import { Controllers } from "~/api/controllers";

export const router = tsr.router(v1Contract, {
  bootstrap: async ({ query }) => Controllers.bootstrap({ q: query }),
  gpg: async ({ query }) => Controllers.gpg({ q: query }),
  debion: async ({ query }) => Controllers.debion({ q: query }),
});

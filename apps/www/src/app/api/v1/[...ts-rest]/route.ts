import { createNextRouteHandler } from "@ts-rest/serverless/next";
import { env } from "@ashgw/env";
import { v1Contract } from "~/app/api/rest/contract";
import { getBootstrap, getGpg, getZshFuncs } from "~/app/api/rest/controllers";

export const { GET, POST, PUT, PATCH, DELETE, OPTIONS } =
  createNextRouteHandler(
    v1Contract,
    {
      bootstrap: async () => {
        const r = await getBootstrap();
        return r;
      },

      gpg: async () => {
        const r = await getGpg();
        return r;
      },

      zshfuncs: async () => {
        const r = await getZshFuncs();
        return r;
      },
    },
    {
      validateResponses: env.NODE_ENV !== "production",
    },
  );

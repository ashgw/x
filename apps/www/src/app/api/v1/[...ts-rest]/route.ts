import { createNextHandler } from "@ts-rest/serverless/next";
import { env } from "@ashgw/env";
import { v1Contract } from "~/app/api/rest/contract";
import { getBootstrap, getGpg, getZshFuncs } from "~/app/api/rest/controllers";

export const runtime = "nodejs";

const handler = createNextHandler(
  v1Contract,
  {
    bootstrap: async () => getBootstrap(),
    gpg: async () => getGpg(),
    zshfuncs: async () => getZshFuncs(),
  },
  {
    handlerType: "app-router",
    basePath: "/api/v1",
    responseValidation: env.NODE_ENV !== "production",
    // cors: true, // not needed for now
  },
);

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as OPTIONS,
};

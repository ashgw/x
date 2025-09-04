import { createNextHandler } from "@ts-rest/serverless/next";
import { env } from "@ashgw/env";
import { v1Contract } from "~/app/api/rest/contract";
import { Controllers } from "~/app/api/rest/controllers";

export const runtime = "nodejs";

const handler = createNextHandler(
  v1Contract,
  {
    bootstrap: async ({ query }) => Controllers.bootstrap({ q: query }),
    gpg: async ({ query }) => Controllers.gpg({ q: query }),
    debion: async ({ query }) => Controllers.debion({ q: query }),
  },
  {
    handlerType: "app-router",
    basePath: "/api/v1",
    responseValidation: env.NODE_ENV !== "production",
    // cors: true, // enable later if you expose public cross-origin
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

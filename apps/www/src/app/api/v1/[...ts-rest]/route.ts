import { createNextHandler } from "@ts-rest/serverless/next";
import { v1Contract } from "~/api/contract";
import { basePath } from "~/api/basePath";
import { router } from "~/api/router";

export const runtime = "edge";

const handler = createNextHandler(v1Contract, router, {
  basePath,
  handlerType: "app-router",
  // eslint-disable-next-line no-restricted-properties
  responseValidation: process.env.NODE_ENV !== "production",
});

export { handler as GET, handler as OPTIONS };

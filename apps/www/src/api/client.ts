import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import { initClient } from "@ts-rest/core";
import { v1Contract } from "./contract";
import { endPoint } from "./endpoint";
import type { InitClientArgs } from "@ts-rest/core";

const args = {
  baseUrl: endPoint,
  baseHeaders: {},
  validateResponse: true,
  throwOnUnknownStatus: true,
  // credentials: "include", // if cookies added
} satisfies InitClientArgs;

export const tsrClient = initClient(v1Contract, args);

export const tsrQueryClient = initTsrReactQuery(v1Contract, args);

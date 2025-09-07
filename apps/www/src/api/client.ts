// TODO: ask cursor to document all this shit
import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import { initClient } from "@ts-rest/core";
import { contract } from "./contract";
import { endPoint } from "./endpoint";
import type { InitClientArgs } from "@ts-rest/core";

// TODO: add docs here
const args = {
  baseUrl: endPoint,
  baseHeaders: {},
  validateResponse: true,
  throwOnUnknownStatus: true,
  jsonQuery: false,
} satisfies InitClientArgs;

export const tsrClientSdk = initClient(contract, args);

export const tsrQueryClientSide = initTsrReactQuery(contract, args);

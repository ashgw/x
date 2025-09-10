// TODO: ask cursor to document all this shit
// TODO: fix why we can't infer errros when using the lciet, the data is inferred correctly, but the erro isent, unlike
// what happens in tRPC
import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import { initClient } from "@ts-rest/core";
import { contract } from "./contract";
import { endPoint } from "./endpoint";
import type { InitClientArgs } from "@ts-rest/core";

const args = {
  baseUrl: endPoint,
  baseHeaders: {},
  validateResponse: true,
  throwOnUnknownStatus: true,
  jsonQuery: false,
} satisfies InitClientArgs;

export const sdk = initClient(contract, args);

export const tsrQueryClientSide = initTsrReactQuery(contract, args);

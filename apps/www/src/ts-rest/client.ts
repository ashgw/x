import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import { initClient } from "@ts-rest/core";
import { contract } from "~/api/contract";
import { endPoint } from "~/ts-rest/endpoint";
import type { InitClientArgs } from "@ts-rest/core";

const args = {
  baseUrl: endPoint,
  baseHeaders: {}, // can be used for auth, for exmaple, extract a CSRF token with a session cookie & send
  validateResponse: true, // If true, validates responses against your schemas at runtime.
  throwOnUnknownStatus: true, //  If true, throws if server returns a status not declared in your contract.
  jsonQuery: false, //  If true, encodes query params as JSON instead of standard URL encoding.
} satisfies InitClientArgs;

export const sdk = initClient(contract, args);

/**
 * React Query integration for ts-rest.
 *
 * Provides auto-generated hooks like:
 * ```ts
 * const { data, error } = tsrQueryClientSide.healthCheck.useQuery(["hc"]);
 * ```
 *
 */
export const tsrQueryClientSide = initTsrReactQuery(contract, args);

import { initClient } from "@ts-rest/core";
import { v1Contract } from "./contract";
import { endPoint } from "./endpoint";

export const client = initClient(v1Contract, {
  baseUrl: endPoint,
  baseHeaders: {},
  validateResponse: true,
  throwOnUnknownStatus: true,
});

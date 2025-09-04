import { initClient } from "@ts-rest/core";
import { v1Contract } from "./contract";
import { basePath } from "./basePath";

export const client = initClient(v1Contract, {
  baseUrl: basePath,
  baseHeaders: {},
});

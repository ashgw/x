import { createSchemaResponses } from "~/@ashgw/ts-rest";
import type { InferResponses } from "~/@ashgw/ts-rest";
import { okSchemaResponse } from "../_shared";

export const healthCheckSchemaResponses = createSchemaResponses({
  ...okSchemaResponse,
});

export type HealthCheckResponses = InferResponses<
  typeof healthCheckSchemaResponses
>;

import { createSchemaResponses } from "ts-rest-kit/core";
import type { InferResponses } from "ts-rest-kit/core";
import { okSchemaResponse } from "../shared";

export const healthCheckSchemaResponses = createSchemaResponses({
  ...okSchemaResponse,
});

export type HealthCheckResponses = InferResponses<
  typeof healthCheckSchemaResponses
>;

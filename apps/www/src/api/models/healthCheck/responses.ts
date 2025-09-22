import { createSchemaResponses } from "~/ts-rest-kit";
import type { InferResponses } from "~/ts-rest-kit";
import { okSchemaResponse } from "../shared";

export const healthCheckSchemaResponses = createSchemaResponses({
  ...okSchemaResponse,
});

export type HealthCheckResponses = InferResponses<
  typeof healthCheckSchemaResponses
>;

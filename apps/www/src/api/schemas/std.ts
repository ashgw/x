import { restSchemaResponse } from "../extended";
import { httpErrorSchemaRo } from "./ros";

export const stdErrorResponses = restSchemaResponse({
  401: httpErrorSchemaRo,
  403: httpErrorSchemaRo,
  404: httpErrorSchemaRo,
  409: httpErrorSchemaRo,
  429: httpErrorSchemaRo,
  424: httpErrorSchemaRo,
  500: httpErrorSchemaRo,
});

export function withStdErrors<T extends Record<number, unknown>>(r: T) {
  return { ...r, ...stdErrorResponses } as const;
}

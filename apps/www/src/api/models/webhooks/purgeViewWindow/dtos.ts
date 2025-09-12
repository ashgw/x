// TODO: to each schema we need to add as many docs as possible so the openAPI defintion
// becomes rich so AI can use it
import type { z } from "zod";
import { cronAuthedMiddlewareHeaderSchemaDto } from "./../../_shared";

// ========== Schemas ==========

export const purgeViewWindowHeadersSchemaDto =
  cronAuthedMiddlewareHeaderSchemaDto;

// ========== Types ==========

export type PurgeViewWindowHeadersDto = z.infer<
  typeof purgeViewWindowHeadersSchemaDto
>;

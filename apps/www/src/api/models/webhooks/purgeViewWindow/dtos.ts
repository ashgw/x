import type { z } from "zod";
import { cronAuthedMiddlewareHeaderSchemaDto } from "../../shared";

// ========== Schemas ==========

export const purgeViewWindowHeadersSchemaDto =
  cronAuthedMiddlewareHeaderSchemaDto;

// ========== Types ==========

export type PurgeViewWindowHeadersDto = z.infer<
  typeof purgeViewWindowHeadersSchemaDto
>;

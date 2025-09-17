import type { z } from "zod";
import { authedMiddlewareHeaderSchemaDto } from "../shared";

// ========== Schemas ==========

export const purgeViewWindowHeadersSchemaDto =
  authedMiddlewareHeaderSchemaDto.extend({});

// ========== Types ==========

export type PurgeViewWindowHeadersDto = z.infer<
  typeof purgeViewWindowHeadersSchemaDto
>;

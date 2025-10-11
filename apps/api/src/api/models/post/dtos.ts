import type { z } from "zod";
import { authedMiddlewareHeaderSchemaDto } from "../shared";

// ========== Schemas ==========

export const postViewWindowDeleteHeadersSchemaDto =
  authedMiddlewareHeaderSchemaDto.extend({});

export const postTrashDeleteHeadersSchemaDto =
  authedMiddlewareHeaderSchemaDto.extend({});

// ========== Types ==========

export type PostTrashDeleteHeadersDto = z.infer<
  typeof postTrashDeleteHeadersSchemaDto
>;

export type PostViewWindowDeleteHeadersDto = z.infer<
  typeof postViewWindowDeleteHeadersSchemaDto
>;

import type { z } from "zod";
import { authedMiddlewareHeaderSchemaDto } from "../shared";

export const purgeViewWindowHeadersSchemaDto =
  authedMiddlewareHeaderSchemaDto.extend({});

export const purgeTrashPostsHeadersSchemaDto =
  authedMiddlewareHeaderSchemaDto.extend({});

export type PurgeTrashPostsHeadersDto = z.infer<
  typeof purgeTrashPostsHeadersSchemaDto
>;

export type PurgeViewWindowHeadersDto = z.infer<
  typeof purgeViewWindowHeadersSchemaDto
>;

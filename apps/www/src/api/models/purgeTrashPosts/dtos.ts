import type { z } from "zod";
import { authedMiddlewareHeaderSchemaDto } from "../shared";

export const purgeTrashPostsHeadersSchemaDto =
  authedMiddlewareHeaderSchemaDto.extend({});

export type PurgeTrashPostsHeadersDto = z.infer<
  typeof purgeTrashPostsHeadersSchemaDto
>;

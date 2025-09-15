import type { z } from "zod";
import { cronAuthedMiddlewareHeaderSchemaDto } from "../shared";

export const purgeTrashPostsHeadersSchemaDto =
  cronAuthedMiddlewareHeaderSchemaDto;

export type PurgeTrashPostsHeadersDto = z.infer<
  typeof purgeTrashPostsHeadersSchemaDto
>;

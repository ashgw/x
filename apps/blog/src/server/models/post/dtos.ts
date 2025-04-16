// Follow this naming convention for zod schemas and types
// <action>-<Entity(s)>-dtoSchema for zod schemas
// <Action>-<Entity(s)>-dto for the types of the dtos

import { z } from "zod";

export const getPostDtoSchema = z.object({
  filename: z.string().min(1),
  blogPath: z.string().min(1),
});

export const getPostsDtoSchema = z.object({
  blogPath: z.string().min(1),
});

export type GetPostsDto = z.infer<typeof getPostsDtoSchema>;
export type GetPostDto = z.infer<typeof getPostDtoSchema>;

// Follow this naming convention for zod schemas and types
// <action>-<Entity(s)>-dtoSchema for zod schemas
// <Action>-<Entity(s)>-dto for the types of the dtos

import { z } from "zod";

export const getBlogDtoSchema = z.object({
  filename: z.string().min(1),
  blogPath: z.string().min(1),
});

export const getBlogsDtoSchema = z.object({
  blogPath: z.string().min(1),
});

export type GetBlogsDto = z.infer<typeof getBlogsDtoSchema>;
export type GetBlogDto = z.infer<typeof getBlogDtoSchema>;

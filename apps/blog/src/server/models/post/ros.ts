// Follow this naming convention for zod schemas and types
// <entity(s)>-schemaRo for zod schemas
// <Entity(s)>-Ro for the types of the schemas

import { z } from "zod";

export enum PostCategoryEnum {
  SOFTWARE = "software",
  HEALTH = "health",
  PHILOSOPHY = "philosophy",
}

export const mdxContentSchemaRo = z.object({
  body: z.string().min(1),
  bodyBegin: z.number(), // needed for MDX parsing
});

export const postDetailSchemaRo = z.object({
  slug: z.string().min(1),
  title: z.string().min(3),
  seoTitle: z.string().min(1),
  summary: z.string().min(1),
  // fetching from mdx file, that's why not a date
  firstModDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{4}$/),
  lastModDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{4}$/),
  isReleased: z.boolean(),
  minutesToRead: z.union([z.string(), z.number()]),
  tags: z.array(z.string()),
  category: z.nativeEnum(PostCategoryEnum),
  mdxContent: mdxContentSchemaRo,
});

export type MdxContentRo = z.infer<typeof mdxContentSchemaRo>;
export type PostDetailRo = z.infer<typeof postDetailSchemaRo>;

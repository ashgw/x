// Follow this naming convention for zod schemas and types
// <entity(s)>-schemaRo for zod schemas
// <Entity(s)>-Ro for the types of the schemas

import { z } from "zod";

export enum PostCategoryEnum {
  SOFTWARE = "software",
  HEALTH = "health",
  PHILOSOPHY = "philosophy",
}

const metaDataAttributesSchemaRo = z.object({
  title: z.string().min(1),
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
});

const mdxFileDataSchemaRo = z.object({
  attributes: metaDataAttributesSchemaRo,
  mdxContent: z.object({
    uri: z.string().min(10),
  }),
  bodyBegin: z.number(), // needed for MDX parsing
});

export const postDetailSchemaRo = z.object({
  slug: z.string().min(1),
  parsedContent: mdxFileDataSchemaRo,
});

export type PostDetailRo = z.infer<typeof postDetailSchemaRo>;

// Follow this naming convention for zod schemas and types
// <entity(s)>-<Intent/View>schemaRo for zod schemas
// <Entity(s)>-<Intent/View>Ro for the types of the schemas

import { z } from "zod";

// Enums
export enum PostCategoryEnum {
  SOFTWARE = "SOFTWARE",
  HEALTH = "HEALTH",
  PHILOSOPHY = "PHILOSOPHY",
}

// ========== Schemas ==========

// this comes from fm library API directly
export const fontMatterMdxContentSchemaRo = z.object({
  body: z.string().min(1),
  bodyBegin: z.number(), // needed for MDX parsing
});

export const postCardSchemaRo = z.object({
  slug: z.string().min(1),
  title: z.string().min(3),
  seoTitle: z.string().min(1),
  summary: z.string().min(1),
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

export const postDetailSchemaRo = postCardSchemaRo.extend({
  fontMatterMdxContent: fontMatterMdxContentSchemaRo,
});

// ========== Types (inferred from schemas) ==========

export type fontMatterMdxContentRo = z.infer<
  typeof fontMatterMdxContentSchemaRo
>;
export type PostCardRo = z.infer<typeof postCardSchemaRo>;
export type PostDetailRo = z.infer<typeof postDetailSchemaRo>;

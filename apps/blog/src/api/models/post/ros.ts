// Follow this naming convention for zod schemas and types
// <entity(s)>-<Intent/View>schemaRo for zod schemas
// <Entity(s)>-<Intent/View>Ro for the types of the schemas

import { z } from "zod";

import { category, mdxText, slug, summary, tags, title } from "./shared";

// ========== Schemas ==========

export const postCardSchemaRo = z.object({
  slug,
  title,
  tags,
  category,
  summary,
  seoTitle: summary,
  firstModDate: z.date(),
  minutesToRead: z.union([z.string(), z.number()]),
  views: z.number().default(0),
});

// this comes from fm library API directly
export const fontMatterMdxContentSchemaRo = z.object({
  body: mdxText,
  bodyBegin: z.number().default(0), // needed for MDX parsing
});

export const postDetailSchemaRo = postCardSchemaRo.extend({
  isReleased: z.boolean(),
  lastModDate: z.date(),
  fontMatterMdxContent: fontMatterMdxContentSchemaRo,
});

export const trashPostSchemaRo = z.object({
  title,
  summary,
  tags,
  category,
  mdxText,
  originalSlug: slug,
  id: z.string().min(1).max(255),
  firstModDate: z.date(),
  lastModDate: z.date(),
  wasReleased: z.boolean(),
  deletedAt: z.date(),
});

// ========== Types (inferred from schemas) ==========

export type fontMatterMdxContentRo = z.infer<
  typeof fontMatterMdxContentSchemaRo
>;
export type PostCardRo = z.infer<typeof postCardSchemaRo>;
export type PostDetailRo = z.infer<typeof postDetailSchemaRo>;

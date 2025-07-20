// Follow this naming convention for zod schemas and types
// <entity(s)>-<Intent/View>schemaRo for zod schemas
// <Entity(s)>-<Intent/View>Ro for the types of the schemas

import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { z } from "zod";

import { PostCategoryEnum } from "./shared";

// ========== Schemas ==========

export const postCardSchemaRo = z.object({
  slug: z.string().min(1),
  title: z.string().min(3),
  seoTitle: z.string().min(1),
  summary: z.string().min(1).max(90),
  firstModDate: z.date(),
  lastModDate: z.date(),
  isReleased: z.boolean(),
  minutesToRead: z.union([z.string(), z.number()]),
  tags: z.array(z.string()),
  category: z.nativeEnum(PostCategoryEnum),
});

// this comes from fm library API but body is now serialized MDX content
export const fontMatterMdxContentSchemaRo = z.object({
  body: z.custom<MDXRemoteSerializeResult>(),
  bodyBegin: z.number(), // needed for MDX parsing
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

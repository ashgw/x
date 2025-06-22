// Follow this naming convention for zod schemas and types
// <entity><action>SchemaDto for zod schemas
// <entity><action>Dto for the types of the dtos

import { z } from "zod";

import { PostCategoryEnum } from "./shared";

// ========== Schemas ==========
export const postGetSchemaDto = z.object({
  slug: z.string().min(1),
});

export const postDeleteSchemaDto = z.object({
  slug: z.string().min(1),
});

export const postEditorSchemaDto = z.object({
  title: z.string().min(2).max(30), // the slug will be the same basically
  summary: z.string().max(90).min(20), // SEO title will be the same for now, 90 chars so it looks good on cards layout
  category: z.nativeEnum(PostCategoryEnum),
  tags: z.array(z.string().max(10).min(1)), // if too big => looks ugly
  isReleased: z.boolean(),
  mdxContent: z.string().min(10).max(30000),
});

export const postUpdateSchemaDto = z.object({
  slug: z.string().min(1),
  data: postEditorSchemaDto,
});

// ========== Types ==========
export type PostGetDto = z.infer<typeof postGetSchemaDto>;
export type PostEditorDto = z.infer<typeof postEditorSchemaDto>;
export type PostUpdateDto = z.infer<typeof postUpdateSchemaDto>;
export type PostDeleteDto = z.infer<typeof postDeleteSchemaDto>;

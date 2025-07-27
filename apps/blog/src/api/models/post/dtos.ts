// Follow this naming convention for zod schemas and types
// <entity><action>SchemaDto for zod schemas
// <entity><action>Dto for the types of the dtos

import { z } from "zod";

import { PostCategoryEnum } from "./shared";

const slugSchema = z.string().min(1).max(255);
// ========== Schemas ==========
export const postGetSchemaDto = z.object({
  slug: slugSchema,
});

export const postDeleteSchemaDto = z.object({
  slug: slugSchema,
});

export const postEditorSchemaDto = z.object({
  title: z.string().min(2).max(30), // the slug will be the same basically
  summary: z.string().min(20).max(90), // SEO title will be the same for now, 90 chars so it looks good on cards layout
  category: z.nativeEnum(PostCategoryEnum),
  tags: z.array(z.string().min(1).max(10)), // if too big => looks ugly
  isReleased: z.boolean(),
  mdxContent: z.string().min(10).max(30000),
});

export const postUpdateSchemaDto = z.object({
  slug: slugSchema,
  data: postEditorSchemaDto,
});

// ========== Types ==========
export type PostGetDto = z.infer<typeof postGetSchemaDto>;
export type PostEditorDto = z.infer<typeof postEditorSchemaDto>;
export type PostUpdateDto = z.infer<typeof postUpdateSchemaDto>;
export type PostDeleteDto = z.infer<typeof postDeleteSchemaDto>;

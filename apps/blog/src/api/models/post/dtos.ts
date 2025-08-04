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
  title: z
    .string()
    .min(2, { message: "Title is too short" })
    .max(30, { message: "Title won't fit on the cards" }), // the slug will be the same basically
  summary: z
    .string()
    .min(20, { message: "Summary is too short" })
    .max(90, { message: "Summary is too long" }), // SEO title will be the same for now, 90 chars so it looks good on cards layout
  category: z.nativeEnum(PostCategoryEnum),
  tags: z.array(
    z.string().min(1).max(10, { message: "Tag is too long, it won't fit" }),
  ),
  isReleased: z.boolean(),
  mdxContent: z
    .string()
    .min(10, { message: "MDX content is required" })
    .max(30000, { message: "MDX content is too long" }),
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

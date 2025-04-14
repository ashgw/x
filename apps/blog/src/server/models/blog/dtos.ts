import { z } from "zod";

export const getBlogsDtoSchema = z.object({
  blogPath: z.string().min(1),
});

export type GetBlogsDto = z.infer<typeof getBlogsDtoSchema>;

export const getBlogDtoSchema = z.object({
  filename: z.string().min(1),
  blogPath: z.string().min(1),
});

export type GetBlogDto = z.infer<typeof getBlogDtoSchema>;

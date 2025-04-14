import { z } from "zod";

export const getBlogDtoSchema = z.object({
  blogPath: z.string().min(1),
});

export type GetBlogDto = z.infer<typeof getBlogDtoSchema>;

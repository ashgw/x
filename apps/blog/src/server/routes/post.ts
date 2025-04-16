import { z } from "zod";

import { publicProcedure, router } from "../../trpc/trpc";
import {
  getBlogDtoSchema,
  getBlogsDtoSchema,
  PostDataSchemaRo,
} from "../models";
import { BlogService } from "../services/blog";

export const postRouter = router({
  getPost: publicProcedure
    .input(getBlogDtoSchema)
    .output(PostDataSchemaRo)
    .query(async ({ input }) => {
      const post = await new BlogService({
        directory: input.blogPath,
      }).getPost({ filename: input.filename });
      return post;
    }),

  getPosts: publicProcedure
    .input(getBlogsDtoSchema)
    .output(z.array(PostDataSchemaRo))
    .query(async ({ input }) => {
      const posts = await new BlogService({
        directory: input.blogPath,
      }).getPosts();
      return posts;
    }),
});

import { z } from "zod";

import { publicProcedure, router } from "../../trpc/trpc";
import {
  getPostDtoSchema,
  getPostsDtoSchema,
  postDataSchemaRo,
} from "../models";
import { BlogService } from "../services/blog";

export const postRouter = router({
  getPost: publicProcedure
    .input(getPostDtoSchema)
    .output(postDataSchemaRo)
    .query(async ({ input }) => {
      const post = await new BlogService({
        directory: input.blogPath,
      }).getPost({ filename: input.filename });
      return post;
    }),

  getPosts: publicProcedure
    .input(getPostsDtoSchema)
    .output(z.array(postDataSchemaRo))
    .query(async ({ input }) => {
      const posts = await new BlogService({
        directory: input.blogPath,
      }).getPosts();
      return posts;
    }),
});

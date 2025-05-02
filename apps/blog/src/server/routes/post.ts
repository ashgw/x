import { z } from "zod";

import { publicProcedure, router } from "../../trpc/trpc";
import { getPostDtoSchema, postDataSchemaRo } from "../models";
import { BlogService } from "../services";

const blogService = new BlogService(); // for pools

export const postRouter = router({
  getPost: publicProcedure
    .input(getPostDtoSchema)
    .output(postDataSchemaRo)
    .query(async ({ input }) => {
      const post = await blogService.getPost({
        filename: input.filename,
      });
      return post;
    }),

  getPosts: publicProcedure
    .output(z.array(postDataSchemaRo))
    .query(async () => {
      const posts = await blogService.getPosts();
      return posts;
    }),
});

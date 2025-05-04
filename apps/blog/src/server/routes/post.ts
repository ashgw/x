import { z } from "zod";

import { publicProcedure, router } from "../../trpc/trpc";
import { postDetailSchemaRo, postGetSchemaDto } from "../models";
import { BlogService } from "../services";

const blogService = new BlogService(); // for pools

export const postRouter = router({
  getPost: publicProcedure
    .input(postGetSchemaDto)
    .output(postDetailSchemaRo)
    .query(async ({ input }) => {
      const post = await blogService.getPost({
        slug: input.slug,
      });
      return post;
    }),

  getPosts: publicProcedure
    .output(z.array(postDetailSchemaRo))
    .query(async () => {
      const posts = await blogService.getPosts();
      return posts;
    }),
});

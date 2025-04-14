import { z } from "zod";

import {
  getBlogDtoSchema,
  getBlogsDtoSchema,
  PostDataSchemaRo,
} from "../models";
import { MdxService } from "../services/mdx";
import { publicProcedure, router } from "../trpc";

export const postRouter = router({
  getPost: publicProcedure
    .input(getBlogDtoSchema)
    .output(PostDataSchemaRo)
    .query(async ({ input }) => {
      const post = await new MdxService({
        directory: input.blogPath,
      }).getPost({ filename: input.filename });
      return post;
    }),

  getPosts: publicProcedure
    .input(getBlogsDtoSchema)
    .output(z.array(PostDataSchemaRo))
    .query(async ({ input }) => {
      const posts = await new MdxService({
        directory: input.blogPath,
      }).getPosts();
      return posts;
    }),
});

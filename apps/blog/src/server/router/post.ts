import { z } from "zod";

import { getBlogDtoSchema, PostDataSchemaRo } from "../models";
import { MdxService } from "../services/mdx";
import { publicProcedure, router } from "../trpc";

export const postRouter = router({
  getPost: publicProcedure
    .input(getBlogDtoSchema)
    .output(z.array(PostDataSchemaRo))
    .query(async ({ input }) => {
      return await new MdxService({ directory: input.blogPath }).getPosts();
    }),

  getPosts: publicProcedure
    .input(getBlogDtoSchema)
    .output(z.array(PostDataSchemaRo))
    .query(async ({ input }) => {
      return await new MdxService({ directory: input.blogPath }).getPosts();
    }),
});

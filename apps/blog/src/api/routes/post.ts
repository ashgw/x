import { z } from "zod";

import { s3Client } from "@ashgw/services";

import { publicProcedure, router } from "../../trpc/trpc";
import {
  postCardSchemaRo,
  postDetailSchemaRo,
  postGetSchemaDto,
} from "../models";
import { BlogService } from "../services";

export const postRouter = router({
  getPost: publicProcedure
    .input(postGetSchemaDto)
    .output(postDetailSchemaRo)
    .query(async ({ input, ctx: { db } }) => {
      const blogService = new BlogService({
        db,
        s3Client,
      });
      return await blogService.getDetailPost({ slug: input.slug });
    }),

  getPostCards: publicProcedure
    .input(z.void())
    .output(z.array(postCardSchemaRo))
    .query(async ({ ctx: { db } }) => {
      const blogService = new BlogService({
        db,
        s3Client,
      });
      return await blogService.getPostCards();
    }),
});

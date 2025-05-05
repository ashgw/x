import { z } from "zod";

import { S3Service } from "@ashgw/services";

import { publicProcedure, router } from "../../trpc/trpc";
import {
  postCardSchemaRo,
  postDetailSchemaRo,
  postGetSchemaDto,
} from "../models";
import { BlogService } from "../services";

const s3Service = new S3Service();

export const postRouter = router({
  getPost: publicProcedure
    .input(postGetSchemaDto)
    .output(postDetailSchemaRo)
    .query(async ({ input, ctx }) => {
      const blogService = new BlogService({
        db: ctx.db,
        s3Service,
      });
      return await blogService.getDetailPost({ slug: input.slug });
    }),

  getPostCards: publicProcedure
    .input(z.void())
    .output(z.array(postCardSchemaRo))
    .query(async ({ ctx }) => {
      const blogService = new BlogService({
        db: ctx.db,
        s3Service,
      });
      return await blogService.getPostCards();
    }),
});

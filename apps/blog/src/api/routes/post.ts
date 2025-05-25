import { z } from "zod";

import { storage } from "@ashgw/storage";

import { publicProcedure, router } from "~/trpc/trpc";
import {
  postCardSchemaRo,
  postDetailSchemaRo,
  postGetSchemaDto,
} from "../models";
import { BlogService } from "../services";

export const postRouter = router({
  getPost: publicProcedure
    .input(postGetSchemaDto)
    .output(postDetailSchemaRo.nullable()) // not found is not an error
    .query(async ({ input: { slug }, ctx: { db } }) => {
      const blogService = new BlogService({
        db,
        storage,
      });

      return await blogService.getDetailPost({ slug });
    }),

  getPostCards: publicProcedure
    .input(z.void())
    .output(z.array(postCardSchemaRo))
    .query(async ({ ctx: { db } }) => {
      const blogService = new BlogService({
        db,
        storage,
      });
      return await blogService.getPostCards();
    }),
});

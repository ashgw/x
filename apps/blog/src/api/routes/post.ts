import { z } from "zod";

import { storage } from "@ashgw/storage";

import { adminProcedure, publicProcedure, router } from "~/trpc/root";
import {
  postCardSchemaRo,
  postDeleteSchemaDto,
  postDetailSchemaRo,
  postEditorSchemaDto,
  postGetSchemaDto,
  postUpdateSchemaDto,
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

  // Admin endpoints
  getAllPosts: adminProcedure
    .input(z.void())
    .output(z.array(postDetailSchemaRo))
    .query(async ({ ctx: { db } }) => {
      const blogService = new BlogService({
        db,
        storage,
      });
      return await blogService.getAllPosts();
    }),

  createPost: adminProcedure
    .input(postEditorSchemaDto)
    .output(postDetailSchemaRo)
    .mutation(async ({ input, ctx: { db } }) => {
      const blogService = new BlogService({
        db,
        storage,
      });
      return await blogService.createPost(input);
    }),

  updatePost: adminProcedure
    .input(postUpdateSchemaDto)
    .output(postDetailSchemaRo)
    .mutation(async ({ input, ctx: { db } }) => {
      const blogService = new BlogService({
        db,
        storage,
      });
      return await blogService.updatePost(input.slug, input.data);
    }),

  deletePost: adminProcedure
    .input(postDeleteSchemaDto)
    .output(z.void())
    .mutation(async ({ input, ctx: { db } }) => {
      const blogService = new BlogService({
        db,
        storage,
      });
      await blogService.deletePost(input.slug);
    }),
});

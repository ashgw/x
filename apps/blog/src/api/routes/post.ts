import { z } from "zod";
import { storage } from "@ashgw/storage";
import { adminProcedure, publicProcedure } from "~/trpc/procedures";
import { router } from "~/trpc/root";
import {
  postCardSchemaRo,
  postDeleteSchemaDto,
  postDetailSchemaRo,
  postEditorSchemaDto,
  postGetSchemaDto,
  postUpdateSchemaDto,
  trashPostSchemaRo,
} from "../models";
import { BlogService } from "../services";

export const postRouter = router({
  getPost: publicProcedure
    .input(postGetSchemaDto)
    .output(postDetailSchemaRo.nullable())
    .query(async ({ input: { slug }, ctx: { db } }) => {
      const blogService = new BlogService({ db, storage });
      return await blogService.getDetailPost({ slug });
    }),

  getPostCards: publicProcedure
    .input(z.void())
    .output(z.array(postCardSchemaRo))
    .query(async ({ ctx: { db } }) => {
      const blogService = new BlogService({ db, storage });
      return await blogService.getPostCards();
    }),

  getAllPosts: adminProcedure
    .input(z.void())
    .output(z.array(postDetailSchemaRo))
    .query(async ({ ctx: { db } }) => {
      const blogService = new BlogService({ db, storage });
      return await blogService.getAllAdminPosts();
    }),

  createPost: adminProcedure
    .input(postEditorSchemaDto)
    .output(postDetailSchemaRo)
    .mutation(async ({ input, ctx: { db } }) => {
      const blogService = new BlogService({ db, storage });
      return await blogService.createPost(input);
    }),

  updatePost: adminProcedure
    .input(postUpdateSchemaDto)
    .output(postDetailSchemaRo)
    .mutation(async ({ input: { data, slug }, ctx: { db } }) => {
      const blogService = new BlogService({ db, storage });
      return await blogService.updatePost({ slug, data });
    }),

  trashPost: adminProcedure
    .input(postDeleteSchemaDto)
    .output(z.void())
    .mutation(async ({ input: { slug }, ctx: { db } }) => {
      const blogService = new BlogService({ db, storage });
      await blogService.trashPost({ originalSlug: slug });
    }),

  getTrashedPosts: adminProcedure
    .input(z.void())
    .output(z.array(trashPostSchemaRo))
    .query(async ({ ctx: { db } }) => {
      const blogService = new BlogService({ db, storage });
      return await blogService.getTrashedPosts();
    }),

  purgeTrash: adminProcedure
    .input(z.object({ trashId: z.string().min(1) }))
    .output(z.void())
    .mutation(async ({ input: { trashId }, ctx: { db } }) => {
      const blogService = new BlogService({ db, storage });
      await blogService.purgeTrash({ trashId });
    }),

  restoreFromTrash: adminProcedure
    .input(z.object({ trashId: z.string().min(1) }))
    .output(z.void())
    .mutation(async ({ input: { trashId }, ctx: { db } }) => {
      const blogService = new BlogService({ db, storage });
      await blogService.restoreFromTrash({ trashId });
    }),
});

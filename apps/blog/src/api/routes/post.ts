import { publicProcedure, router } from "../../trpc/trpc";
import { postDetailSchemaRo, postGetSchemaDto } from "../models";
import { BlogService, S3Service } from "../services";

const s3Service = new S3Service();

export const postRouter = router({
  getPost: publicProcedure
    .input(postGetSchemaDto)
    .output(postDetailSchemaRo)
    .query(async ({ input, ctx }) => {
      const blogService = new BlogService({
        ctx,
        s3Service,
      });
      return await blogService.getPost({ slug: input.slug });
    }),

  // getPosts: publicProcedure
  //   .output(z.array(postDetailSchemaRo))
  //   .query(async () => {
  //     const posts = await blogService.getPosts();
  //     return posts;
  //   }),
});

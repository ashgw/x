import { InternalError } from "@ashgw/observability";

import type { TrpcContext } from "../../../trpc/context";
import type { S3Service } from "../s3";
import { PostMapper } from "~/server/mappers";
import { PostQueryHelper } from "~/server/query-helpers";

export class BlogService {
  constructor(
    private readonly ctx: TrpcContext,
    private s3Service: S3Service,
  ) {}

  public async getPost({ slug }: { slug: string }) {
    const _fileContent = await this.s3Service.fetchFile({
      key: "mdx" + "/" + slug,
    });
    const post = await this.ctx.db.post.findUnique({
      where: {
        slug,
      },
      include: {
        ...PostQueryHelper.detailInclude(),
      },
    });
    if (!post) {
      throw new InternalError({
        code: "NOT_FOUND",
        message: "Cannot find a post with the given slug" + slug,
      });
    }
    const _postDetailRo = PostMapper.toDetailRo({
      post,
    });
  }
}

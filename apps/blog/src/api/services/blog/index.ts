import type { FrontMatterResult } from "front-matter";
import fm from "front-matter";

import { InternalError } from "@ashgw/observability";

import type { S3Service } from "../s3";
import type { MdxContentRo, PostDetailRo } from "~/api/models";
import type { TrpcContext } from "~/trpc/context";
import { PostMapper } from "~/api/mappers";
import { mdxContentSchemaRo } from "~/api/models";
import { PostQueryHelper } from "~/api/query-helpers";

export class BlogService {
  private readonly ctx: TrpcContext;
  private readonly s3Service: S3Service;

  constructor({ ctx, s3Service }: { ctx: TrpcContext; s3Service: S3Service }) {
    this.ctx = ctx;
    this.s3Service = s3Service;
  }

  public async getPost({ slug }: { slug: string }): Promise<PostDetailRo> {
    const mdxFileContentBuffer = await this.s3Service.fetchFile({
      filename: slug,
      folder: "mdx",
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
        message: "Cannot find a post with the given slug: " + slug,
      });
    }
    const fontMatterMdxBodyContent = this._parseMDX({
      content: mdxFileContentBuffer.toString("utf-8"),
      slug,
    });

    const postDetailRo = PostMapper.toDetailRo({
      post,
      mdxContent: fontMatterMdxBodyContent,
    });
    return postDetailRo;
  }

  private _parseMDX({
    content,
    slug,
  }: {
    content: string;
    slug: string;
  }): MdxContentRo {
    try {
      const parsed: FrontMatterResult<"none"> = fm(content);
      return mdxContentSchemaRo.parse(parsed);
    } catch (error) {
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: `MDX parsing failed for file: ${slug} with content: ${content.slice(0, 100)}`,
        cause: error,
      });
    }
  }
}

import type { FrontMatterResult } from "front-matter";
import fm from "front-matter";

import type { DatabaseClient } from "@ashgw/db";
import { InternalError } from "@ashgw/observability";

import type { S3Service } from "../s3";
import type {
  fontMatterMdxContentRo,
  PostCardRo,
  PostDetailRo,
} from "~/api/models";
import { PostMapper } from "~/api/mappers";
import { fontMatterMdxContentSchemaRo } from "~/api/models";
import { PostQueryHelper } from "~/api/query-helpers";

export class BlogService {
  private readonly db: DatabaseClient;
  private readonly s3Service: S3Service;

  constructor({ db, s3Service }: { db: DatabaseClient; s3Service: S3Service }) {
    this.db = db;
    this.s3Service = s3Service;
  }

  public async getPostCards(): Promise<PostCardRo[]> {
    const posts = await this.db.post.findMany({
      where: PostQueryHelper.whereReleasedToPublic(),
      include: PostQueryHelper.cardInclude(),
    });

    if (posts.length === 0) {
      throw new InternalError({
        code: "NOT_FOUND",
        message: "No posts found at all",
      });
    }
    return posts.map((post) => PostMapper.toCardRo({ post }));
  }

  public async getDetailPost({
    slug,
  }: {
    slug: string;
  }): Promise<PostDetailRo> {
    const mdxFileContentBuffer = await this.s3Service.fetchFileInFolder({
      filename: slug,
      folder: "mdx",
    });

    const post = await this.db.post.findUnique({
      where: {
        slug,
        ...PostQueryHelper.whereReleasedToPublic(),
      },
      include: PostQueryHelper.detailInclude(),
    });

    if (!post) {
      throw new InternalError({
        code: "NOT_FOUND",
        message: "Cannot find a post with the given slug: " + slug,
      });
    }

    const fontMatterMdxContent = this._parseMDX({
      content: mdxFileContentBuffer.toString("utf-8"),
      slug,
    });

    const postDetailRo = PostMapper.toDetailRo({
      post,
      fontMatterMdxContent,
    });

    return postDetailRo;
  }

  private _parseMDX({
    content,
    slug,
  }: {
    content: string;
    slug: string;
  }): fontMatterMdxContentRo {
    try {
      const parsed: FrontMatterResult<"none"> = fm(content);
      return fontMatterMdxContentSchemaRo.parse(parsed);
    } catch (error) {
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: `MDX parsing failed for file: ${slug} with content: ${content.slice(0, 100)}`,
        cause: error,
      });
    }
  }
}

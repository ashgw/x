import type { FrontMatterResult } from "front-matter";
import type { Optional } from "ts-roids";
import fm from "front-matter";

import type { DatabaseClient } from "@ashgw/db";
import type { StorageClient } from "@ashgw/storage";
import { InternalError } from "@ashgw/observability";

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
  private readonly storageClient: StorageClient;

  constructor({
    db,
    storageClient,
  }: {
    db: DatabaseClient;
    storageClient: StorageClient;
  }) {
    this.db = db;
    this.storageClient = storageClient;
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
  }): Promise<Optional<PostDetailRo>> {
    const post = await this.db.post.findUnique({
      where: {
        slug,
        ...PostQueryHelper.whereReleasedToPublic(),
      },
      include: PostQueryHelper.detailInclude(),
    });

    if (!post) {
      // no need to throw here, since user might just be fucking around with the URL
      return null;
    }

    const mdxFileContentBuffer = await this.storageClient.fetchAnyFile({
      key: post.mdxContent.key,
    });

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
        message: `MDX parsing failed for conent: ${slug} with content: ${content.slice(0, 100)}`,
        cause: error,
      });
    }
  }
}

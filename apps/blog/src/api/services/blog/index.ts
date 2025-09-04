import type { FrontMatterResult } from "front-matter";
import type { Optional } from "ts-roids";
import fm from "front-matter";

import type { DatabaseClient } from "@ashgw/db";
import type { StorageClient } from "@ashgw/storage";
import { WordCounterService } from "@ashgw/cross-runtime";
import { InternalError, logger } from "@ashgw/observability";

import type {
  fontMatterMdxContentRo,
  PostCardRo,
  PostDetailRo,
  PostEditorDto,
  TrashPostRo,
} from "~/api/models";
import type { PostCategoryEnum } from "~/api/models";
import { PostMapper } from "~/api/mappers";
import { fontMatterMdxContentSchemaRo } from "~/api/models";
import { PostQueryHelper } from "~/api/query-helpers";

export class BlogService {
  private readonly db: DatabaseClient;
  // storage still injected for images or future assets...
  private readonly storage: StorageClient;

  constructor({ db, storage }: { db: DatabaseClient; storage: StorageClient }) {
    this.db = db;
    this.storage = storage;
  }

  public async getPostCards(): Promise<PostCardRo[]> {
    try {
      const posts = await this.db.post.findMany({
        where: PostQueryHelper.whereReleasedToPublic(),
        select: {
          ...PostQueryHelper.cardSelect(),
        },
        orderBy: { firstModDate: "desc" },
      });

      return posts.map((post) =>
        PostMapper.toCardRo({
          post,
        }),
      );
    } catch (error) {
      logger.error("getPostCards", { error });
      return [];
    }
  }

  public async getAllPosts(): Promise<PostDetailRo[]> {
    const posts = await this.db.post.findMany({
      include: PostQueryHelper.adminInclude(),
      orderBy: { firstModDate: "desc" },
    });
    if (posts.length === 0) return [];

    return posts.map((post) =>
      PostMapper.toDetailRo({
        post,
        fontMatterMdxContent: this._parseMDX({
          content: post.mdxText,
          slug: post.slug,
        }),
      }),
    );
  }

  public async getTrashedPosts(): Promise<TrashPostRo[]> {
    try {
      const trashed = await this.db.trashPost.findMany({
        orderBy: { deletedAt: "desc" },
      });
      if (trashed.length === 0) return [];

      // Prisma returns plain objects that match TrashPost schema already
      return trashed.map((t) => ({
        id: t.id,
        title: t.title,
        summary: t.summary,
        tags: t.tags,
        category: t.category as unknown as PostCategoryEnum,
        mdxText: t.mdxText,
        originalSlug: t.originalSlug,
        firstModDate: t.firstModDate,
        lastModDate: t.lastModDate,
        wasReleased: t.wasReleased,
        deletedAt: t.deletedAt,
      }));
    } catch (error) {
      logger.error("Failed to get trashed posts", { error });
      return [];
    }
  }

  public async getDetailPost({
    slug,
  }: {
    slug: string;
  }): Promise<Optional<PostDetailRo>> {
    const post = await this.db.post.findUnique({
      where: { slug, ...PostQueryHelper.whereReleasedToPublic() },
      include: PostQueryHelper.detailInclude(),
    });
    if (!post) return null;

    return PostMapper.toDetailRo({
      post,
      fontMatterMdxContent: this._parseMDX({ content: post.mdxText, slug }),
    });
  }

  public async createPost(data: PostEditorDto): Promise<PostDetailRo> {
    try {
      const slug = this._slugify(data.title);

      const existingPost = await this.db.post.findUnique({ where: { slug } });
      if (existingPost) {
        throw new InternalError({
          code: "CONFLICT",
          message: `A post with slug "${slug}" already exists`,
        });
      }

      const now = new Date();
      const minutesToRead = WordCounterService.countMinutesToRead(data.mdxText);

      const post = await this.db.post.create({
        data: {
          slug,
          title: data.title,
          seoTitle: data.title,
          summary: data.summary,
          isReleased: data.isReleased,
          firstModDate: now,
          lastModDate: now,
          minutesToRead,
          tags: data.tags,
          category: data.category,
          mdxText: data.mdxText,
        },
        include: PostQueryHelper.detailInclude(),
      });

      return PostMapper.toDetailRo({
        post,
        fontMatterMdxContent: this._parseMDX({
          content: data.mdxText,
          slug,
        }),
      });
    } catch (error) {
      logger.error("Failed to create post", { error });
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create post",
        cause: error,
      });
    }
  }

  public async updatePost({
    data,
    slug,
  }: {
    slug: string;
    data: PostEditorDto;
  }): Promise<PostDetailRo> {
    try {
      const existingPost = await this.db.post.findUnique({
        where: { slug },
        select: { slug: true },
      });
      if (!existingPost) {
        throw new InternalError({
          code: "NOT_FOUND",
          message: `Post with slug "${slug}" not found`,
        });
      }

      const minutesToRead = WordCounterService.countMinutesToRead(data.mdxText);

      const post = await this.db.post.update({
        where: { slug },
        data: {
          title: data.title,
          seoTitle: data.title,
          summary: data.summary,
          isReleased: data.isReleased,
          lastModDate: new Date(),
          minutesToRead,
          tags: data.tags,
          category: data.category,
          mdxText: data.mdxText,
        },
        include: PostQueryHelper.detailInclude(),
      });

      return PostMapper.toDetailRo({
        post,
        fontMatterMdxContent: this._parseMDX({
          content: data.mdxText,
          slug,
        }),
      });
    } catch (error) {
      logger.error("Failed to update post", { error, slug, data });
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update post",
        cause: error instanceof Error ? error : undefined,
      });
    }
  }

  /**
   * Move a live post to TrashPost. (no support for images or other assets yet)
   */
  public async trashPost({
    originalSlug,
  }: {
    originalSlug: string;
  }): Promise<void> {
    try {
      const post = await this.db.post.findUnique({
        where: { slug: originalSlug },
      });
      if (!post) {
        throw new InternalError({
          code: "NOT_FOUND",
          message: `Post with slug "${originalSlug}" not found`,
        });
      }

      await this.db.$transaction(async (tx) => {
        await tx.trashPost.create({
          data: {
            originalSlug: post.slug,
            title: post.title,
            seoTitle: post.seoTitle,
            summary: post.summary,
            firstModDate: post.firstModDate,
            lastModDate: post.lastModDate,
            wasReleased: post.isReleased,
            minutesToRead: post.minutesToRead,
            tags: post.tags,
            category: post.category,
            mdxText: post.mdxText,
          },
        });

        await tx.post.delete({ where: { slug: post.slug } });
      });

      logger.info("Post moved to trash", { originalSlug });
    } catch (error) {
      logger.error("Failed to move post to trash", { error, originalSlug });
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to move post to trash",
        cause: error,
      });
    }
  }

  public async purgeTrash({ trashId }: { trashId: string }): Promise<void> {
    try {
      await this.db.trashPost.delete({ where: { id: trashId } });
    } catch (error) {
      logger.error("Failed to purge trash", { error, trashId });
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to purge trash",
        cause: error,
      });
    }
  }

  public async restoreFromTrash({
    trashId,
  }: {
    trashId: string;
  }): Promise<void> {
    try {
      const trash = await this.db.trashPost.findUnique({
        where: { id: trashId },
      });
      if (!trash) {
        throw new InternalError({
          code: "NOT_FOUND",
          message: "Trash item not found",
        });
      }

      const exists = await this.db.post.findUnique({
        where: { slug: trash.originalSlug },
      });
      if (exists) {
        throw new InternalError({
          code: "CONFLICT",
          message: "A live post already uses this slug",
        });
      }

      await this.db.$transaction(async (tx) => {
        await tx.post.create({
          data: {
            slug: trash.originalSlug,
            title: trash.title,
            seoTitle: trash.seoTitle,
            summary: trash.summary,
            firstModDate: trash.firstModDate,
            lastModDate: trash.lastModDate,
            isReleased: trash.wasReleased,
            minutesToRead: trash.minutesToRead,
            tags: trash.tags,
            category: trash.category,
            mdxText: trash.mdxText,
          },
        });
        await tx.trashPost.delete({ where: { id: trashId } });
      });
    } catch (error) {
      logger.error("Failed to restore from trash", { error, trashId });
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to restore from trash",
        cause: error,
      });
    }
  }

  private _parseMDX({
    content,
    slug,
  }: {
    content: string;
    slug: string;
  }): fontMatterMdxContentRo {
    try {
      const parsed: FrontMatterResult<":"> = fm(content);
      return fontMatterMdxContentSchemaRo.parse(parsed);
    } catch (error) {
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: `MDX parsing failed for content: ${slug} with content: ${content.slice(0, 100)}`,
        cause: error,
      });
    }
  }

  private _slugify(title: string): string {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
}

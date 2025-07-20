import type { FrontMatterResult } from "front-matter";
import type { Optional } from "ts-roids";
import fm from "front-matter";
import { serialize } from "next-mdx-remote/serialize";

import type { DatabaseClient } from "@ashgw/db";
import type { StorageClient } from "@ashgw/storage";
import { WordCounterService } from "@ashgw/cross-runtime";
import { InternalError, logger } from "@ashgw/observability";

import type {
  fontMatterMdxContentRo,
  PostCardRo,
  PostDetailRo,
  PostEditorDto,
} from "~/api/models";
import { PostMapper } from "~/api/mappers";
import { fontMatterMdxContentSchemaRo } from "~/api/models";
import { PostQueryHelper } from "~/api/query-helpers";

export class BlogService {
  private readonly db: DatabaseClient;
  private readonly storage: StorageClient;

  constructor({ db, storage }: { db: DatabaseClient; storage: StorageClient }) {
    this.db = db;
    this.storage = storage;
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

  public async getAllPosts(): Promise<PostDetailRo[]> {
    const posts = await this.db.post.findMany({
      include: PostQueryHelper.adminInclude(),
      orderBy: {
        firstModDate: "desc",
      },
    });

    if (posts.length === 0) {
      logger.info("No posts found in admin view");
      return [];
    }

    return await Promise.all(
      posts.map(async (post) => {
        try {
          const mdxFileContentBuffer = await this.storage.fetchAnyFile({
            key: post.mdxContent.key,
          });

          const fontMatterMdxContent = await this._parseMDX({
            content: mdxFileContentBuffer.toString("utf-8"),
            slug: post.slug,
          });

          return PostMapper.toDetailRo({
            post,
            fontMatterMdxContent,
          });
        } catch (error) {
          logger.error("Error processing post in admin view", {
            slug: post.slug,
            error,
          });
          // Return a minimal version with error indication
          return PostMapper.toDetailRo({
            post,
            fontMatterMdxContent: {
              body: {
                compiledSource: "Error loading content",
                scope: {},
                frontmatter: {},
              },
              bodyBegin: 0,
            },
          });
        }
      }),
    );
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

    const mdxFileContentBuffer = await this.storage.fetchAnyFile({
      key: post.mdxContent.key,
    });

    const fontMatterMdxContent = await this._parseMDX({
      content: mdxFileContentBuffer.toString("utf-8"),
      slug,
    });

    const postDetailRo = PostMapper.toDetailRo({
      post,
      fontMatterMdxContent,
    });
    return postDetailRo;
  }

  public async createPost(data: PostEditorDto): Promise<PostDetailRo> {
    try {
      // Generate slug from title
      const slug = data.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen

      // Check if slug already exists
      const existingPost = await this.db.post.findUnique({
        where: { slug },
      });

      if (existingPost) {
        throw new InternalError({
          code: "CONFLICT",
          message: `A post with slug "${slug}" already exists`,
        });
      }

      const key = await this.storage.uploadFile({
        folder: "mdx",
        filename: `${slug}.mdx`,
        body: Buffer.from(data.mdxContent),
        contentType: "text/markdown",
      });

      // Create MDX content entry in database
      const mdxContent = await this.db.upload.create({
        data: {
          key,
          type: "MDX",
          entityType: "POST",
          contentType: "text/markdown",
        },
      });

      const now = new Date();
      const minutesToRead = WordCounterService.countMinutesToRead(
        data.mdxContent,
      );

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
          mdxContentId: mdxContent.key,
        },
        include: PostQueryHelper.detailInclude(),
      });

      return PostMapper.toDetailRo({
        post,
        fontMatterMdxContent: {
          body: data.mdxContent,
          bodyBegin: 0,
        },
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
        select: {
          slug: true,
        },
      });

      if (!existingPost) {
        throw new InternalError({
          code: "NOT_FOUND",
          message: `Post with slug "${slug}" not found`,
        });
      }

      // Update MDX content
      await this.storage.uploadFile({
        folder: "mdx",
        filename: `${slug}.mdx`,
        body: Buffer.from(data.mdxContent),
        contentType: "text/markdown",
      });

      const minutesToRead = WordCounterService.countMinutesToRead(
        data.mdxContent,
      );

      // Update post in db
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
        },
        include: PostQueryHelper.detailInclude(),
      });

      return PostMapper.toDetailRo({
        post,
        fontMatterMdxContent: {
          body: data.mdxContent,
          bodyBegin: 0,
        },
      });
    } catch (error) {
      logger.error("Failed to update post", { error, slug, data });
      if (error instanceof Error) {
        throw new InternalError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update post",
          cause: error,
        });
      }
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update post: Unknown error",
      });
    }
  }

  public async deletePost(slug: string): Promise<void> {
    try {
      // Find the post first
      const post = await this.db.post.findUnique({
        where: { slug },
        include: { mdxContent: true },
      });

      if (!post) {
        throw new InternalError({
          code: "NOT_FOUND",
          message: `Post with slug "${slug}" not found`,
        });
      }

      await this.db.$transaction(async (tx) => {
        // 1. Delete the post (which should cascade to the Upload)
        await tx.post.delete({
          where: { slug },
        });

        // 2. Verify the upload is gone (double-check)
        // TODO: remove after testing
        const uploadExists = await tx.upload.findUnique({
          where: { key: post.mdxContent.key },
        });

        if (uploadExists) {
          // If cascade didn't work, explicitly delete
          await tx.upload.delete({
            where: { key: post.mdxContent.key },
          });
        }
      });

      // After DB transaction succeeds, delete from S3
      try {
        await this.storage.deleteFile({
          filename: `${slug}.mdx`,
          folder: "mdx",
        });
      } catch (s3Error) {
        // Log but don't fail the operation - file can be cleaned up later
        logger.error("Failed to delete MDX file from storage", {
          key: post.mdxContent.key,
          error: s3Error,
        });
      }

      logger.info("Post and associated content deleted successfully", { slug });
    } catch (error) {
      logger.error("Failed to delete post", { error, slug });
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete post",
        cause: error,
      });
    }
  }

  private async _parseMDX({
    content,
    slug,
  }: {
    content: string;
    slug: string;
  }): Promise<fontMatterMdxContentRo> {
    try {
      const parsed: FrontMatterResult<":"> = fm(content);
      const serializedContent = await serialize(parsed.body);

      return fontMatterMdxContentSchemaRo.parse({
        body: serializedContent,
        bodyBegin: parsed.bodyBegin,
      });
    } catch (error) {
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: `MDX parsing failed for conent: ${slug} with content: ${content.slice(0, 100)}`,
        cause: error,
      });
    }
  }
}

import path from "path";
import fm from "front-matter";

import { InternalError, logger } from "@ashgw/observability";

import type { MdxFileContentRo, PostDetailRo } from "~/server/models";
import { mdxFileContentSchemaRo } from "~/server/models";
import { S3Service } from "../s3";

export class BlogService {
  private readonly EXT = ".mdx";
  private static readonly s3Service = new S3Service();

  public async getPosts(): Promise<PostDetailRo[]> {
    const folder = "mdx";

    try {
      const keys = await BlogService.s3Service.listAllFilesInFolder({ folder });
      logger.info(`Found ${keys.length} files in S3 folder: ${folder}`);

      const mdxKeys = keys.filter((k) => path.extname(k) === this.EXT); // keep full key
      logger.info(`Found ${mdxKeys.length} MDX files in S3 folder: ${folder}`);

      const posts = await Promise.all(
        mdxKeys.map(async (key) => {
          const metadata = await this._readMDXFileFromS3(key); // pass key as-is
          return {
            parsedContent: metadata,
            slug: path.basename(key, this.EXT), // strip folder+ext
          };
        }),
      );

      return posts;
    } catch (error) {
      logger.error("Failed to get posts", error);
      throw new InternalError({
        code: "NOT_FOUND",
        message: `Failed to get posts from S3 folder: ${folder}`,
        cause: error,
      });
    }
  }

  public async getPost({ slug }: { slug: string }): Promise<PostDetailRo> {
    const s3Key = `mdx/${slug}${this.EXT}`; // always POSIX for S3

    try {
      // Check if the file exists in S3
      await BlogService.s3Service.checkFileExists({ key: s3Key });

      const buffer = await BlogService.s3Service.fetchAnyFile({
        filename: s3Key,
      });
      const rawContent = buffer.toString("utf-8");
      const metadata = this._parseMDX(rawContent, s3Key);
      return {
        parsedContent: metadata,
        slug,
      };
    } catch (error) {
      throw new InternalError({
        code: "NOT_FOUND",
        message: `Post not found: ${slug} in S3 at ${s3Key}`,
        cause: error,
      });
    }
  }

  private async _readMDXFileFromS3(s3Key: string): Promise<MdxFileContentRo> {
    try {
      const buffer = await BlogService.s3Service.fetchAnyFile({
        filename: s3Key,
      });
      const rawContent = buffer.toString("utf-8");
      return this._parseMDX(rawContent, s3Key);
    } catch (error) {
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Could not read MDX file from S3: ${s3Key}`,
        cause: error,
      });
    }
  }

  private _parseMDX(content: string, filePath: string): MdxFileContentRo {
    try {
      const parsed = fm(content);
      return mdxFileContentSchemaRo.parse(parsed);
    } catch (error) {
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: `MDX parsing failed for file: ${filePath} with content: ${content.slice(0, 100)}`,
        cause: error,
      });
    }
  }
}

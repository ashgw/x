import path from "path";
import fm from "front-matter";

import { InternalError, logger } from "@ashgw/observability";

import type { MdxFileDataRo, PostDataRo } from "~/server/models";
import { mdxFileDataSchemaRo } from "~/server/models";
import { S3Service } from "../s3";

export class BlogService {
  private readonly EXT = ".mdx";
  private readonly s3Service = new S3Service();
  private readonly baseDir: string;

  constructor(dto: { directory: string }) {
    this.baseDir = dto.directory;
  }

  public async getPosts(): Promise<PostDataRo[]> {
    const folder = "mdx";

    try {
      const fileNames = await this.s3Service.listAllFilesInFolder({
        folder,
      });

      const mdxFiles = fileNames.filter(
        (file) => path.extname(file) === this.EXT,
      ); // in case we messed up the content type

      const posts = await Promise.all(
        mdxFiles.map(async (file) => {
          const s3Key = path.join(this.baseDir, file);
          const metadata = await this._readMDXFileFromS3(s3Key);
          return {
            parsedContent: metadata,
            filename: path.basename(file, this.EXT),
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

  public async getPost({
    filename,
  }: {
    filename: string;
  }): Promise<PostDataRo> {
    const s3Key = path.join(this.baseDir, `${filename}${this.EXT}`);

    try {
      // Check if the file exists in S3
      await this.s3Service.checkFileExists({ key: s3Key });

      const buffer = await this.s3Service.fetchFile({ filename: s3Key });
      const rawContent = buffer.toString("utf-8");
      const metadata = this._parseMDX(rawContent, s3Key);
      return {
        parsedContent: metadata,
        filename,
      };
    } catch (error) {
      throw new InternalError({
        code: "NOT_FOUND",
        message: `Post not found: ${filename} in S3 at ${s3Key}`,
        cause: error,
      });
    }
  }

  private async _readMDXFileFromS3(s3Key: string): Promise<MdxFileDataRo> {
    try {
      const buffer = await this.s3Service.fetchFile({ filename: s3Key });
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

  private _parseMDX(content: string, filePath: string): MdxFileDataRo {
    try {
      const parsed = fm(content);
      return mdxFileDataSchemaRo.parse(parsed);
    } catch (error) {
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: `MDX parsing failed for file: ${filePath} with content: ${content.slice(0, 100)}`,
        cause: error,
      });
    }
  }
}

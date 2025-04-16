import { promises as fsPromises } from "fs";
import path from "path";
import fm from "front-matter";

import { InternalError, sentry } from "@ashgw/observability";

import type { MdxFileDataRo, PostDataRo } from "~/server/models";
import { mdxFileDataSchemaRo } from "~/server/models";

export class BlogService {
  private readonly baseDir: string;
  private readonly EXT = ".mdx";

  constructor(dto: { directory: string }) {
    this.baseDir = path.join(process.cwd(), dto.directory);
  }

  public async getPosts(): Promise<PostDataRo[]> {
    try {
      const files = await fsPromises.readdir(this.baseDir);
      const mdxFiles = files.filter((file) => path.extname(file) === this.EXT);

      const posts = await Promise.all(
        mdxFiles.map(async (file) => {
          const metadata = await this._readMDXFile(
            path.join(this.baseDir, file),
          );
          return {
            parsedContent: metadata,
            filename: path.basename(file, this.EXT),
          };
        }),
      );

      return posts;
    } catch (error) {
      throw this._wrapError(error, "getPosts");
    }
  }

  public async getPost({
    filename,
  }: {
    filename: string;
  }): Promise<PostDataRo> {
    const filePath = path.join(this.baseDir, `${filename}${this.EXT}`);
    try {
      try {
        await fsPromises.access(filePath);
      } catch (error) {
        throw new InternalError({
          code: "NOT_FOUND",
          message: `Post not found: ${filename}`,
          cause: sentry.next.captureException({ error }),
        });
      }

      const metadata = await this._readMDXFile(filePath);
      return {
        parsedContent: metadata,
        filename,
      };
    } catch (error) {
      throw this._wrapError(error, `getPost(${filename})`);
    }
  }

  private _parseMDX(content: string): MdxFileDataRo {
    const result = fm(content);
    try {
      const parsedResult = mdxFileDataSchemaRo.parse(result);
      return parsedResult;
    } catch (error) {
      if (error instanceof Error) {
        error.message = `MDX parsing validation failed: ${error.message}`;
      }
      throw error;
    }
  }

  private async _readMDXFile(filePath: string): Promise<MdxFileDataRo> {
    const rawContent = await fsPromises.readFile(filePath, "utf-8");
    return this._parseMDX(rawContent);
  }

  private _wrapError(error: unknown, ctx: string): InternalError {
    const errorMessage = `BlogService.${ctx} failed in ${this.baseDir}`;
    sentry.next.captureException({
      error,
      withErrorLogging: {
        message: errorMessage,
      },
    });
    return new InternalError({
      code: "INTERNAL_SERVER_ERROR",
      message: errorMessage,
      cause: errorMessage,
    });
  }
}

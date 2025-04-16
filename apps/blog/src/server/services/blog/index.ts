import { promises as fsPromises } from "fs";
import path from "path";
import fm from "front-matter";

import { InternalError, logger, sentry } from "@ashgw/observability";

import type { MdxFileDataRo, PostDataRo } from "~/server/models";

export class BlogService {
  private readonly baseDir: string;

  constructor(dto: { directory: string }) {
    this.baseDir = path.join(process.cwd(), dto.directory);
    // Write a file to record the directory name
    void fsPromises
      .writeFile(
        path.join(process.cwd(), ".blog-directory"),
        dto.directory,
        "utf-8",
      )
      .catch((error) => {
        sentry.next.captureException({
          error,
        });
      });
  }

  public async getPosts(): Promise<PostDataRo[]> {
    try {
      const files = await fsPromises.readdir(this.baseDir);
      const mdxFiles = files.filter((file) => path.extname(file) === ".mdx");

      const blogDataPromises = mdxFiles.map(async (file) => {
        const parsedContent = await this._readMDXFile(
          path.join(this.baseDir, file),
        );
        return {
          parsedContent,
          filename: path.basename(file, path.extname(file)),
        };
      });

      return Promise.all(blogDataPromises);
    } catch (error) {
      const errorMessage = `Failed to read blog posts from directory ${this.baseDir}`;
      sentry.next.captureException({
        error,
      });
      logger.error(errorMessage);
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: errorMessage,
        cause: error,
      });
    }
  }

  public async getPost({
    filename,
  }: {
    filename: string;
  }): Promise<PostDataRo> {
    const filePath = path.join(this.baseDir, `${filename}.mdx`);
    try {
      const parsedContent = await this._readMDXFile(filePath);

      return {
        parsedContent,
        filename,
      };
    } catch (error) {
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to read blog posts from directory ${this.baseDir}`,
        cause: sentry.next.captureException({
          error,
        }),
      });
    }
  }

  private _parseMDX(content: string): MdxFileDataRo {
    return fm(content) as MdxFileDataRo;
  }

  private async _readMDXFile(filePath: string): Promise<MdxFileDataRo> {
    try {
      const rawContent = await fsPromises.readFile(filePath, "utf-8");
      return this._parseMDX(rawContent);
    } catch (error) {
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to read blog posts from directory ${this.baseDir}`,
        cause: sentry.next.captureException({
          error,
        }),
      });
    }
  }
}

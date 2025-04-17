import { promises as fsPromises } from "fs";
import path from "path";
import fm from "front-matter";

import { InternalError } from "@ashgw/observability";

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
          const filePath = path.join(this.baseDir, file);
          const metadata = await this._readMDXFile(filePath);
          return {
            parsedContent: metadata,
            filename: path.basename(file, this.EXT),
          };
        }),
      );

      return posts;
    } catch (error) {
      throw new InternalError({
        code: "NOT_FOUND",
        message: `Failed to get posts from directory: ${this.baseDir}`,
        cause: error,
      });
    }
  }

  public async getPost({
    filename,
  }: {
    filename: string;
  }): Promise<PostDataRo> {
    const filePath = path.join(this.baseDir, `${filename}${this.EXT}`);

    try {
      await fsPromises.access(filePath);
    } catch (error) {
      throw new InternalError({
        code: "NOT_FOUND",
        message: `Post not found: ${filename} in ${this.baseDir}`,
        cause: error,
      });
    }

    try {
      const metadata = await this._readMDXFile(filePath);
      return {
        parsedContent: metadata,
        filename,
      };
    } catch (error) {
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to read or parse post: ${filename} in ${this.baseDir}`,
        cause: error,
      });
    }
  }

  private async _readMDXFile(filePath: string): Promise<MdxFileDataRo> {
    try {
      const rawContent = await fsPromises.readFile(filePath, "utf-8");
      return this._parseMDX(rawContent, filePath);
    } catch (error) {
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Could not read MDX file from disk: ${filePath}`,
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

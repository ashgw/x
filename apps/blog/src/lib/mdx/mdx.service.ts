import { promises as fsPromises } from "fs";
import path from "path";
import fm from "front-matter";

import { InternalError } from "@ashgw/observability";

import type { MdxFileData, PostData } from "./mdx.models";

export class MdxService {
  private readonly baseDir: string;

  constructor(blogDirectory: string) {
    this.baseDir = path.join(process.cwd(), blogDirectory);
  }

  public async getPosts(): Promise<PostData[]> {
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
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to read blog posts from directory ${this.baseDir}`,
        cause: error,
      });
    }
  }

  public async getPost(filename: string): Promise<PostData> {
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
        message: `Failed to read blog post ${filename}`,
        cause: error,
      });
    }
  }

  private _parseMDX(content: string): MdxFileData {
    return fm(content) as MdxFileData;
  }

  private async _readMDXFile(filePath: string): Promise<MdxFileData> {
    try {
      const rawContent = await fsPromises.readFile(filePath, "utf-8");
      return this._parseMDX(rawContent);
    } catch (error) {
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to read MDX file from ${filePath}`,
        cause: error,
      });
    }
  }
}

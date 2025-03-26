"use server";

import { promises as fsPromises } from "fs";
import path from "path";
import fm from "front-matter";

import { sentry } from "@ashgw/observability";

import type { MdxFileData, PostData } from "./mdx.models";

export class MdxService {
  private readonly baseDir: string;

  constructor(blogDirectory: string) {
    this.baseDir = path.join(process.cwd(), blogDirectory);
  }

  public async getBlogPosts(): Promise<PostData[]> {
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
  }

  public async getBlogPost(slug: string): Promise<PostData> {
    const filePath = path.join(this.baseDir, `${slug}.mdx`);
    const parsedContent = await this._readMDXFile(filePath);

    return {
      parsedContent,
      filename: slug,
    };
  }
  private _parseMDX(content: string): MdxFileData {
    return fm(content) as MdxFileData;
  }

  private async _readMDXFile(filePath: string): Promise<MdxFileData> {
    try {
      const rawContent = await fsPromises.readFile(filePath, "utf-8");
      return this._parseMDX(rawContent);
    } catch (error) {
      sentry.next.captureException({
        error,
        message: `Failed to read MDX file: ${filePath}`,
      });
      throw error;
    }
  }
}

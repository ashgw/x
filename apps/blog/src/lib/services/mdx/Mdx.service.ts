import { promises as fsPromises } from "fs";
import path from "path";
import fm from "front-matter";

import type { MDXData, PostData } from "./types";

type Optional<T> = T | null;
type MaybeUndefined<T> = T | undefined;

export class MdxService {
  private mdxDirectory: string;

  constructor({ mdxDirectory }: { mdxDirectory: string }) {
    this.mdxDirectory = mdxDirectory;
  }

  public async getPost({
    slug,
  }: {
    slug: string;
  }): Promise<Optional<PostData>> {
    const blogs = await this.getPosts();
    if (blogs === null) {
      return null;
    }
    const blogPost: MaybeUndefined<PostData> = blogs.find(
      (p) => p.filename === slug,
    );
    if (blogPost === undefined) {
      return null;
    }
    return blogPost;
  }

  public async getPosts(): Promise<Optional<PostData[]>> {
    return this._getMDXData({
      dir: path.join(process.cwd(), this.mdxDirectory),
    });
  }

  private async _getMDXData({
    dir,
  }: {
    dir: string;
  }): Promise<Optional<PostData[]>> {
    const mdxFiles = await this._getMDXFiles({ dir });
    if (mdxFiles === null) {
      return null;
    }
    const blogDataPromises = mdxFiles.map(async (file) => {
      const parsedContent = await this._readMDXFile({
        filePath: path.join(dir, file),
      });
      const filename: string = path.basename(file, path.extname(file));
      return {
        parsedContent,
        filename,
      };
    });

    const blogData = await Promise.all(blogDataPromises);
    return blogData as PostData[];
  }

  private async _readMDXFile({
    filePath,
  }: {
    filePath: string;
  }): Promise<Optional<MDXData>> {
    try {
      const rawContent = await fsPromises.readFile(filePath, "utf-8");
      return this._parseMDX(rawContent);
    } catch (error) {
      console.error("Error reading MDX file:", error);
      return null;
    }
  }
  private _parseMDX(content: string): MDXData {
    return fm(content) as MDXData;
  }
  private async _getMDXFiles({
    dir,
  }: {
    dir: string;
  }): Promise<Optional<string[]>> {
    try {
      const files = await fsPromises.readdir(dir);
      const mdxFiles = files.filter((file) => path.extname(file) === ".mdx");
      return mdxFiles;
    } catch (error) {
      console.error("Error reading MDX files:", error);
      return null;
    }
  }
}

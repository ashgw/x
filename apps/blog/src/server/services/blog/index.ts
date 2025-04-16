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
    // fm is unpredictable, so we parse the result with zod
    const result = fm(content);
    const parsedResult = mdxFileDataSchemaRo.parse(result);
    return parsedResult;
  }

  private async _readMDXFile(filePath: string): Promise<MdxFileDataRo> {
    const rawContent = await fsPromises.readFile(filePath, "utf-8");
    return this._parseMDX(rawContent);
  }

  private _wrapError(error: unknown, ctx: string): InternalError {
    return new InternalError({
      code: "INTERNAL_SERVER_ERROR",
      message: `BlogService.${ctx} failed in ${this.baseDir}`,
      cause: sentry.next.captureException({ error }),
    });
  }
}

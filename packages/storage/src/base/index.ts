export const folders = ["mdx", "voice", "image", "other"] as const;
export type Folder = (typeof folders)[number];

export abstract class BaseStorageSerivce {
  public abstract fetchFileInFolder<F extends Folder>(params: {
    folder: F;
    filename: string;
  }): Promise<Buffer>;

  public abstract fetchAnyFile(params: { key: string }): Promise<Buffer>;

  /**
   * Uploads a file to the specified folder in storage
   * @param params Upload parameters including folder, filename, content and optional content type
   * @returns The full path/key of the uploaded file (e.g. "mdx/my-blog-post.mdx")
   */
  public abstract uploadFile(params: {
    folder: Folder;
    filename: string;
    body: Buffer;
    contentType?: string;
  }): Promise<string>;
}

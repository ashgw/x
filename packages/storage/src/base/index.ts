export const folders = ["mdx", "voice", "image", "other"] as const;
export type Folder = (typeof folders)[number];

export abstract class BaseStorageService {
  /**
   * Fetches a file from the specified folder in storage
   * @param params Fetch parameters including folder and filename
   * @returns The file content as a Buffer
   */
  public abstract fetchFile<F extends Folder>(params: {
    folder: F;
    filename: string;
  }): Promise<Buffer>;

  /**
   * Uploads a file to the specified S3 folder
   * @param params Upload parameters object
   * @param params.folder The folder to upload to (mdx, voice, image, other)
   * @param params.filename The name of the file to upload
   * @param params.body The file content as Buffer
   * @param params.contentType Optional MIME type of the file
   * @returns The full path/key of the uploaded file (e.g. "mdx/my-blog-post.mdx")
   */
  public abstract uploadFile(params: {
    folder: Folder;
    filename: string;
    body: Buffer;
    contentType?: string;
  }): Promise<string>;

  /**
   * Deletes a file from the specified folder in storage
   * @param params Delete parameters including folder and filename
   * @returns The full path/key of the deleted file
   */
  public abstract deleteFile<F extends Folder>(params: {
    folder: F;
    filename: string;
  }): Promise<string>;

  public abstract deleteAnyFile(params: { key: string }): Promise<string>;
  public abstract fetchAnyFile(params: { key: string }): Promise<Buffer>;
  public abstract uploadAnyFile(params: { key: string }): Promise<string>;
}

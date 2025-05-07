export const folders = ["mdx", "voice", "image", "other"] as const;
export type Folder = (typeof folders)[number];

export abstract class BaseStorageSerivce {
  public abstract fetchFileInFolder<F extends Folder>(params: {
    folder: F;
    filename: string;
  }): Promise<Buffer>;

  public abstract fetchAnyFile(params: { key: string }): Promise<Buffer>;

  public abstract uploadFile(params: {
    folder: Folder;
    filename: string;
    body: Buffer;
    contentType?: string;
  }): Promise<void>;
}

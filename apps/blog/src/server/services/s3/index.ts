import { S3 } from "aws-sdk";

import { env } from "@ashgw/env";
import { InternalError } from "@ashgw/observability";

export const folders = ["mdx", "voice", "image", "other"] as const;
export type Folder = (typeof folders)[number];

export class S3Service {
  private readonly client: S3;
  private readonly bucket: string;

  constructor() {
    this.client = new S3({
      region: env.S3_BUCKET_REGION,
      accessKeyId: env.S3_BUCKET_ACCESS_KEY_ID,
      secretAccessKey: env.S3_BUCKET_SECRET_KEY,
    });
    this.bucket = env.S3_BUCKET_NAME;
  }

  public async listAllFiles(): Promise<string[]> {
    return this._listKeysWithPrefix({ prefix: "" });
  }

  public async listAllFilesInFolder({
    folder,
  }: {
    folder: Folder;
  }): Promise<string[]> {
    return this._listKeysWithPrefix({ prefix: `${folder}/` });
  }

  public async fetchFile({ filename }: { filename: string }): Promise<Buffer> {
    const res = await this.client
      .getObject({
        Bucket: this.bucket,
        Key: filename,
      })
      .promise();

    if (!res.Body || !(res.Body instanceof Buffer)) {
      throw new InternalError({
        code: "NOT_FOUND",
        message: `File ${filename} not found or invalid`,
      });
    }

    return res.Body;
  }

  public async uploadFile({
    key,
    body,
    contentType,
  }: {
    key: string;
    body: Buffer;
    contentType?: string;
  }): Promise<void> {
    try {
      await this.client
        .putObject({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        })
        .promise();
    } catch (err) {
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Upload failed for key "${key}"`,
        cause: err,
      });
    }
  }

  public async listDecomposed(): Promise<{
    mdx: string[];
    voice: string[];
    image: string[];
    other: string[];
  }> {
    const all = await this.listAllFiles();
    return {
      mdx: all.filter((key) => key.startsWith("mdx/")),
      voice: all.filter((key) => key.startsWith("voice/")),
      image: all.filter((key) => key.startsWith("image/")),
      other: all.filter(
        (key) =>
          !key.startsWith("mdx/") &&
          !key.startsWith("voice/") &&
          !key.startsWith("image/"),
      ),
    };
  }

  private async _listKeysWithPrefix({
    prefix,
  }: {
    prefix: string;
  }): Promise<string[]> {
    const objects: string[] = [];
    let ContinuationToken: string | undefined;

    do {
      const res = await this.client
        .listObjectsV2({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken,
        })
        .promise();

      res.Contents?.forEach((obj) => {
        if (obj.Key) objects.push(obj.Key);
      });

      ContinuationToken = res.IsTruncated
        ? res.NextContinuationToken
        : undefined;
    } while (ContinuationToken);

    return objects;
  }
}

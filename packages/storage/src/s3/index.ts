import type { Readable } from "stream";
import type { MaybeUndefined } from "ts-roids";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { env } from "@ashgw/env";
import { InternalError } from "@ashgw/observability";

/**
 * Top‑level folders in the bucket.
 */
export const folders = ["mdx", "voice", "image", "other"] as const;
export type Folder = (typeof folders)[number];

export class S3Service {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor() {
    this.client = new S3Client({
      region: env.S3_BUCKET_REGION,
      credentials: {
        accessKeyId: env.S3_BUCKET_ACCESS_KEY_ID,
        secretAccessKey: env.S3_BUCKET_SECRET_KEY,
      },
    });
    this.bucket = env.S3_BUCKET_NAME;
  }

  public async fetchFileInFolder<F extends Folder>({
    folder,
    filename,
  }: {
    folder: F;
    filename: string;
  }): Promise<Buffer> {
    return this.fetchAnyFile({ key: `${folder}/${filename}` });
  }

  public async fetchAnyFile({ key }: { key: string }): Promise<Buffer> {
    const { Body } = await this.client.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
    );

    if (!Body) {
      throw new InternalError({
        code: "NOT_FOUND",
        message: `File ${key} not found`,
      });
    }

    return this.streamToBuffer(Body as Readable);
  }

  public async uploadFile({
    folder,
    filename,
    body,
    contentType,
  }: {
    folder: Folder;
    filename: string;
    body: Buffer;
    contentType?: string;
  }): Promise<void> {
    const key = `${folder}/${filename}`;

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        }),
      );
    } catch (err) {
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Upload failed for key "${key}"`,
        cause: err,
      });
    }
  }

  /** Convert a Node stream returned by AWS SDK v3 into a Buffer. */
  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
  }
}

declare global {
  // eslint-disable-next-line no-var
  var _s3Client: MaybeUndefined<S3Service>;
}

export const s3Client = global._s3Client ?? new S3Service();
export type S3Client = typeof s3Client;

if (env.NODE_ENV !== "production") global._s3Client = s3Client;

import { setTimeout } from "timers/promises";
import type { Readable } from "stream";
import type { MaybeUndefined } from "ts-roids";
import {
  S3Client as AwsS3Client,
  GetObjectCommand,
  PutObjectCommand,
  S3ServiceException,
} from "@aws-sdk/client-s3";

import { env } from "@ashgw/env";
import { InternalError } from "@ashgw/observability";

import type { Folder } from "../base";
import { BaseStorageClient } from "../base";

// Add retry constant
const MAX_RETRIES = 3;

export class S3Service extends BaseStorageClient {
  protected readonly cache = new Map<
    string,
    { data: Buffer; timestamp: number }
  >();
  protected readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  protected readonly client: AwsS3Client;
  protected readonly bucket: string;

  constructor() {
    super();
    this.client = new AwsS3Client({
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
    // check cache first
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    let attempts = 0;
    let lastError: unknown;

    while (attempts < MAX_RETRIES) {
      try {
        const { Body } = await this.client.send(
          new GetObjectCommand({ Bucket: this.bucket, Key: key }),
        );

        if (!Body) {
          throw new InternalError({
            code: "NOT_FOUND",
            message: `File ${key} not found`,
          });
        }

        const buffer = await this.streamToBuffer(Body as Readable);
        this.cache.set(key, { data: buffer, timestamp: Date.now() });
        return buffer;
      } catch (err) {
        lastError = err;
        attempts++;

        if (
          err instanceof S3ServiceException &&
          (err.name === "SlowDown" || err.name === "RequestTimeout")
        ) {
          await setTimeout(Math.pow(2, attempts) * 100);
          continue;
        }

        throw this.formatError(err, key);
      }
    }

    throw this.formatError(lastError, key);
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
    let attempts = 0;
    let lastError: unknown;

    while (attempts < MAX_RETRIES) {
      try {
        await this.client.send(
          new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: body,
            ContentType: contentType,
          }),
        );

        this.cache.set(key, { data: body, timestamp: Date.now() });
        return;
      } catch (err) {
        lastError = err;
        attempts++;

        if (
          err instanceof S3ServiceException &&
          (err.name === "SlowDown" || err.name === "RequestTimeout")
        ) {
          await setTimeout(Math.pow(2, attempts) * 100);
          continue;
        }

        throw this.formatError(err, key);
      }
    }

    throw this.formatError(lastError, key);
  }

  /** Convert a Node stream returned by AWS SDK v3 into a Buffer. */
  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(
        typeof chunk === "string" ? Buffer.from(chunk) : (chunk as Uint8Array),
      );
    }
    return Buffer.concat(chunks);
  }

  protected formatError(err: unknown, key: string): Error {
    if (err instanceof S3ServiceException && err.name === "NoSuchKey") {
      return new InternalError({
        code: "NOT_FOUND",
        message: `File ${key} not found`,
        cause: err,
      });
    }

    return new InternalError({
      code: "INTERNAL_SERVER_ERROR",
      message: `S3 operation failed for key "${key}"`,
      cause: err,
    });
  }
}

declare global {
  // eslint-disable-next-line no-var
  var _s3Client: MaybeUndefined<S3Service>;
}

export const s3Client = global._s3Client ?? new S3Service();
export type S3Client = typeof s3Client;

if (env.NODE_ENV !== "production") global._s3Client = s3Client;

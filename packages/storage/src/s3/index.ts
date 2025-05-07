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
import { BaseStorageSerivce } from "../base";

// Add retry constant
const MAX_RETRIES = 3;

export class S3Service extends BaseStorageSerivce {
  /**
   * In-memory cache for S3 objects with timestamp for TTL tracking.
   * @private
   */
  protected readonly cache = new Map<
    string,
    { data: Buffer; timestamp: number }
  >();

  /**
   * Cache time-to-live in milliseconds (5 minutes).
   * @private
   */
  protected static readonly CACHE_TTL = 5 * 60 * 1000;

  /**
   * Maximum number of items to keep in cache to prevent memory leaks.
   * @private
   */
  protected static readonly MAX_CACHE_SIZE = 100;

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

  public override async fetchFileInFolder<F extends Folder>({
    folder,
    filename,
  }: {
    folder: F;
    filename: string;
  }): Promise<Buffer> {
    return this.fetchAnyFile({ key: `${folder}/${filename}` });
  }

  public override async fetchAnyFile({
    key,
  }: {
    key: string;
  }): Promise<Buffer> {
    // check cache first
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < S3Service.CACHE_TTL) {
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
        this._pruneCache();

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

  public override async uploadFile({
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
        this._pruneCache();

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

  /**
   * Prunes the cache by removing oldest entries when size exceeds the maximum limit.
   * @private
   */
  private _pruneCache(): void {
    if (this.cache.size > S3Service.MAX_CACHE_SIZE) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const entriesToRemove = entries.slice(
        0,
        entries.length - S3Service.MAX_CACHE_SIZE,
      );
      for (const [entryKey] of entriesToRemove) {
        this.cache.delete(entryKey);
      }
    }
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

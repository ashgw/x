import type { MaybeUndefined } from "ts-roids";
import { S3 } from "aws-sdk";

import { env } from "@ashgw/env";
import { InternalError } from "@ashgw/observability";

/**
 * An array of valid top‐level folder names in our S3 bucket.
 */
export const folders = ["mdx", "voice", "image", "other"] as const;

/**
 * Union type of valid folder strings ("mdx" | "voice" | "image" | "other").
 */
export type Folder = (typeof folders)[number];

/**
 * S3Service
 *
 * Encapsulates all interactions with AWS S3:
 * - Listing objects (with or without a prefix)
 * - Fetching object bodies
 * - Uploading objects
 * - Checking existence
 * - Decomposing a flat list into folder categories
 */
export class S3Service {
  private readonly client: S3;
  private readonly bucket: string;

  /**
   * Constructor
   *
   * Initializes an aws-sdk S3 client using credentials and bucket
   * details from the centralized env package.
   */
  constructor() {
    this.client = new S3({
      region: env.S3_BUCKET_REGION,
      accessKeyId: env.S3_BUCKET_ACCESS_KEY_ID,
      secretAccessKey: env.S3_BUCKET_SECRET_KEY,
    });
    this.bucket = env.S3_BUCKET_NAME;
  }

  /**
   * fetchFileInFolder
   *
   * Downloads a file from a specific folder in S3 and returns its body as a Buffer.
   *
   * @param folder - The folder in the S3 bucket (must be one of the predefined Folder values)
   * @param filename - The name of the file within the folder
   * @returns The file contents as a Buffer
   * @throws InternalError if the object does not exist or the Body is not a Buffer
   */
  public async fetchFileInFolder<F extends Folder>({
    filename,
    folder,
  }: {
    folder: F;
    filename: string;
  }): Promise<Buffer> {
    return this.fetchAnyFile({
      key: `${folder}/${filename}`,
    });
  }

  /**
   * fetchAnyFile
   *
   * Downloads the object at the given key from S3 and returns its body as a Buffer.
   *
   * @param key - The full key of the file in S3 (including folder if needed)
   * @returns The file contents as a Buffer
   * @throws InternalError if the object does not exist or the Body is not a Buffer
   */
  public async fetchAnyFile({ key }: { key: string }): Promise<Buffer> {
    const res = await this.client
      .getObject({ Bucket: this.bucket, Key: key })
      .promise();

    if (!res.Body) {
      throw new InternalError({
        code: "NOT_FOUND",
        message: `File ${key} not found`,
      });
    }

    // Accept Buffer or generic Uint8Array
    return Buffer.isBuffer(res.Body)
      ? res.Body
      : Buffer.from(res.Body as Uint8Array);
  }

  /**
   * uploadFile
   *
   * Uploads a Buffer to the configured S3 bucket.
   *
   * @param key - Destination key in S3
   * @param body - File content as Buffer
   * @param contentType - Optional MIME type header
   * @param folder - One of the predefined Folder values
   * @param filename - The filename to use in S3 (with the extension)
   * @throws InternalError on upload failure
   */
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
}

declare global {
  // eslint-disable-next-line no-var
  var _s3Client: MaybeUndefined<S3Service>;
}

// This ensures singleton across hot reloads in dev
export const s3Client = global._s3Client ?? new S3Service();

if (env.NODE_ENV !== "production") global._s3Client = s3Client;

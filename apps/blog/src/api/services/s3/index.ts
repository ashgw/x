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
   * listAllFiles
   *
   * Returns a promise resolving to an array of all keys in the bucket.
   */
  public async listAllFiles(): Promise<string[]> {
    return this._listKeysWithPrefix({ prefix: "" });
  }

  /**
   * listAllFilesInFolder
   *
   * Lists all keys under a specific folder prefix, e.g. "mdx/".
   *
   * @param folder - One of the predefined Folder values
   */
  public async listAllFilesInFolder({
    folder,
  }: {
    folder: Folder;
  }): Promise<string[]> {
    return this._listKeysWithPrefix({ prefix: `${folder}/` });
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

  /**
   * listDecomposed
   *
   * Fetches all file keys and splits them into separate arrays
   * based on the four known folder prefixes.
   *
   * @returns An object mapping each folder to its list of keys
   */
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

  /**
   * _listKeysWithPrefix (private)
   *
   * Utility method that pages through S3 listObjectsV2 results,
   * collecting all keys matching the given prefix.
   *
   * @param prefix - Key prefix to filter on (empty string = all keys)
   * @returns An array of keys under the specified prefix
   */
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

  /**
   * checkFileExists
   *
   * Performs a headObject call to determine if a key exists.
   *
   * @param key - The object key to check
   * @returns true if the object exists, false if S3 returns NotFound
   * @throws InternalError for any other S3 errors
   */
  public async checkFileExists({ key }: { key: string }): Promise<boolean> {
    try {
      await this.client
        .headObject({
          Bucket: this.bucket,
          Key: key,
        })
        .promise();

      return true;
    } catch (error) {
      // S3 returns a code "NotFound" when the object does not exist
      if ((error as { code?: string }).code === "NotFound") {
        return false;
      }

      // Wrap any other error in our InternalError type
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to check if file exists in S3: ${key}`,
        cause: error,
      });
    }
  }
}

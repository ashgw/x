import type { S3Client } from "./s3";
import { s3Client } from "./s3";

export const storage = s3Client;
export type StorageClient = S3Client;

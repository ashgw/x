import type { S3Client } from "./s3";
import { s3Client } from "./s3";

export const storageClient = s3Client;
export type StorageClient = S3Client;

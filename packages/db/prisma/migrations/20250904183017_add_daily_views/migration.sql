/*
  Warnings:

  - You are about to drop the `PostView` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "viewsCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "PostView";

-- CreateTable
CREATE TABLE "PostViewWindow" (
    "id" TEXT NOT NULL,
    "postSlug" VARCHAR(255) NOT NULL,
    "fingerprint" VARCHAR(64) NOT NULL,
    "bucketStart" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PostViewWindow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostViewWindow_bucketStart_idx" ON "PostViewWindow"("bucketStart");

-- CreateIndex
CREATE INDEX "PostViewWindow_postSlug_bucketStart_idx" ON "PostViewWindow"("postSlug", "bucketStart");

-- CreateIndex
CREATE UNIQUE INDEX "PostViewWindow_postSlug_fingerprint_bucketStart_key" ON "PostViewWindow"("postSlug", "fingerprint", "bucketStart");

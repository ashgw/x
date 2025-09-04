/*
  Warnings:

  - The values [MDX] on the enum `UploadType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `mdxContentId` on the `Post` table. All the data in the column will be lost.
  - Added the required column `mdxText` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UploadType_new" AS ENUM ('IMAGE', 'AUDIO', 'OTHER');
ALTER TABLE "Upload" ALTER COLUMN "type" TYPE "UploadType_new" USING ("type"::text::"UploadType_new");
ALTER TYPE "UploadType" RENAME TO "UploadType_old";
ALTER TYPE "UploadType_new" RENAME TO "UploadType";
DROP TYPE "UploadType_old";
COMMIT;

-- DropIndex
DROP INDEX "Post_mdxContentId_idx";

-- DropIndex
DROP INDEX "Post_mdxContentId_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "mdxContentId",
ADD COLUMN     "mdxText" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TrashPost" (
    "id" TEXT NOT NULL,
    "originalSlug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(30) NOT NULL,
    "seoTitle" VARCHAR(100) NOT NULL,
    "summary" VARCHAR(100) NOT NULL,
    "firstModDate" TIMESTAMP(3) NOT NULL,
    "lastModDate" TIMESTAMP(3) NOT NULL,
    "wasReleased" BOOLEAN NOT NULL,
    "minutesToRead" SMALLINT NOT NULL,
    "tags" VARCHAR(255)[],
    "category" "PostCategory" NOT NULL,
    "mdxText" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrashPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrashPost_originalSlug_idx" ON "TrashPost"("originalSlug");

-- CreateIndex
CREATE INDEX "TrashPost_deletedAt_idx" ON "TrashPost"("deletedAt");

-- CreateIndex
CREATE INDEX "Post_lastModDate_idx" ON "Post"("lastModDate");

-- CreateIndex
CREATE INDEX "Post_isReleased_lastModDate_idx" ON "Post"("isReleased", "lastModDate");

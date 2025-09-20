-- CreateEnum
CREATE TYPE "PostCategory" AS ENUM ('SOFTWARE', 'HEALTH', 'PHILOSOPHY');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('POST');

-- CreateEnum
CREATE TYPE "UploadType" AS ENUM ('IMAGE', 'AUDIO', 'MDX', 'OTHER');

-- CreateTable
CREATE TABLE "Post" (
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(30) NOT NULL,
    "summary" VARCHAR(100) NOT NULL,
    "firstModDate" TIMESTAMP(3) NOT NULL,
    "lastModDate" TIMESTAMP(3) NOT NULL,
    "isReleased" BOOLEAN NOT NULL,
    "minutesToRead" SMALLINT NOT NULL,
    "tags" VARCHAR(255)[],
    "category" "PostCategory" NOT NULL,
    "mdxContentId" VARCHAR(255) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Upload" (
    "key" VARCHAR(512) NOT NULL,
    "type" "UploadType" NOT NULL,
    "entityType" "ResourceType" NOT NULL DEFAULT 'POST',
    "contentType" VARCHAR(100) NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Upload_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_mdxContentId_key" ON "Post"("mdxContentId");

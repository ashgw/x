-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SOFTWARE', 'HEALTH', 'PHILOSOPHY');

-- CreateEnum
CREATE TYPE "UploadType" AS ENUM ('IMAGE', 'AUDIO', 'MDX');

-- CreateEnum
CREATE TYPE "UploadEntityType" AS ENUM ('POST');

-- CreateTable
CREATE TABLE "PostBodyContent" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "s3Key" VARCHAR(512) NOT NULL,
    "contentType" VARCHAR(50) NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostBodyContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "seoTitle" VARCHAR(300) NOT NULL,
    "summary" VARCHAR(300) NOT NULL,
    "s3Key" VARCHAR(512) NOT NULL,
    "contentType" VARCHAR(50) NOT NULL,
    "size" INTEGER NOT NULL,
    "firstModDate" TIMESTAMP(3) NOT NULL,
    "lastModDate" TIMESTAMP(3) NOT NULL,
    "isReleased" BOOLEAN NOT NULL,
    "isSequel" BOOLEAN NOT NULL,
    "minutesToRead" SMALLINT NOT NULL,
    "tags" TEXT[],
    "category" "Category" NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Upload" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(512) NOT NULL,
    "type" "UploadType" NOT NULL,
    "contentType" VARCHAR(100) NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entityType" "UploadEntityType" NOT NULL DEFAULT 'POST',
    "entityId" TEXT NOT NULL,

    CONSTRAINT "Upload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostBodyContent_name_key" ON "PostBodyContent"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Upload_key_key" ON "Upload"("key");

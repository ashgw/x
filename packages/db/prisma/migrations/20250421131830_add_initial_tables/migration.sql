-- CreateEnum
CREATE TYPE "PostCategory" AS ENUM ('SOFTWARE', 'HEALTH', 'PHILOSOPHY');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('READ', 'WRITE', 'EDIT', 'DELETE', 'PUBLISH');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('POST');

-- CreateEnum
CREATE TYPE "UploadType" AS ENUM ('IMAGE', 'AUDIO', 'MDX');

-- CreateTable
CREATE TABLE "Post" (
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "seoTitle" VARCHAR(300) NOT NULL,
    "summary" VARCHAR(300) NOT NULL,
    "firstModDate" TIMESTAMP(3) NOT NULL,
    "lastModDate" TIMESTAMP(3) NOT NULL,
    "isReleased" BOOLEAN NOT NULL,
    "minutesToRead" SMALLINT NOT NULL,
    "tags" VARCHAR(15)[],
    "category" "PostCategory" NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" VARCHAR(255),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "ActionType" NOT NULL,
    "resource" "ResourceType" NOT NULL,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upload" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(512) NOT NULL,
    "url" VARCHAR(1024) NOT NULL,
    "type" "UploadType" NOT NULL,
    "entityType" "ResourceType" NOT NULL DEFAULT 'POST',
    "contentType" VARCHAR(100) NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entityId" VARCHAR(255),

    CONSTRAINT "Upload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "UserPermission_userId_idx" ON "UserPermission"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_userId_action_resource_key" ON "UserPermission"("userId", "action", "resource");

-- CreateIndex
CREATE UNIQUE INDEX "Upload_key_key" ON "Upload"("key");

-- CreateIndex
CREATE INDEX "Upload_entityId_idx" ON "Upload"("entityId");

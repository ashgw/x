-- DropIndex
DROP INDEX "PostView_createdAt_idx";

-- DropIndex
DROP INDEX "PostView_postSlug_fingerprint_createdAt_idx";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "viewsTotal" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PostView" ADD COLUMN     "viewDayUTC" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "PostViewDaily" (
    "postSlug" VARCHAR(255) NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PostViewDaily_pkey" PRIMARY KEY ("postSlug","day")
);

-- CreateIndex
CREATE INDEX "PostViewDaily_day_idx" ON "PostViewDaily"("day");

-- CreateIndex
CREATE INDEX "PostView_postSlug_createdAt_idx" ON "PostView"("postSlug", "createdAt");

-- CreateIndex
CREATE INDEX "PostView_postSlug_viewDayUTC_idx" ON "PostView"("postSlug", "viewDayUTC");

-- CreateIndex
CREATE INDEX "PostView_viewDayUTC_idx" ON "PostView"("viewDayUTC");

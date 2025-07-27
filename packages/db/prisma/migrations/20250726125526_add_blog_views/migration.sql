-- CreateTable
CREATE TABLE "PostView" (
    "id" TEXT NOT NULL,
    "postSlug" VARCHAR(255) NOT NULL,
    "fingerprint" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostView_postSlug_fingerprint_createdAt_idx" ON "PostView"("postSlug", "fingerprint", "createdAt");

-- CreateIndex
CREATE INDEX "PostView_createdAt_idx" ON "PostView"("createdAt");

-- CreateIndex
CREATE INDEX "PostView_fingerprint_idx" ON "PostView"("fingerprint");

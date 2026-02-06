-- CreateEnum
CREATE TYPE "ThumbnailType" AS ENUM ('NONE', 'FAVICON', 'CUSTOM');

-- AlterTable
ALTER TABLE "page_links" ADD COLUMN     "scheduledEndAt" TIMESTAMP(3),
ADD COLUMN     "scheduledStartAt" TIMESTAMP(3),
ADD COLUMN     "thumbnailType" "ThumbnailType" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "thumbnailUrl" TEXT;

-- CreateIndex
CREATE INDEX "page_links_scheduledStartAt_idx" ON "page_links"("scheduledStartAt");

-- CreateIndex
CREATE INDEX "page_links_scheduledEndAt_idx" ON "page_links"("scheduledEndAt");

-- AlterTable
ALTER TABLE "pages" ADD COLUMN     "facebookPixelId" TEXT,
ADD COLUMN     "googleAnalyticsId" TEXT,
ADD COLUMN     "isNsfw" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "pages_isNsfw_idx" ON "pages"("isNsfw");

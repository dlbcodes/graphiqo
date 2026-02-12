/*
  Warnings:

  - A unique constraint covering the columns `[shareToken]` on the table `charts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "charts" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shareToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "charts_shareToken_key" ON "charts"("shareToken");

/*
  Warnings:

  - You are about to drop the column `thumbnailUrl` on the `page_links` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "page_links" DROP COLUMN "thumbnailUrl",
ADD COLUMN     "thumbnail" TEXT;

/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `video_cards` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `video_cards` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `video_cards` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "video_cards" DROP COLUMN "imageUrl",
DROP COLUMN "thumbnailUrl",
DROP COLUMN "videoUrl",
ADD COLUMN     "imageFile" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "thumbnailFile" TEXT,
ADD COLUMN     "videoFile" TEXT;

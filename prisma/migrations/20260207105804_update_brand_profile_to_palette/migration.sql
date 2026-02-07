/*
  Warnings:

  - You are about to drop the column `primaryColor` on the `brand_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryColor` on the `brand_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "brand_profiles" DROP COLUMN "primaryColor",
DROP COLUMN "secondaryColor",
ADD COLUMN     "palette" TEXT[],
ADD COLUMN     "textColor" TEXT NOT NULL DEFAULT '#374151';

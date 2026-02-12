/*
  Warnings:

  - Made the column `shareToken` on table `charts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "charts" ALTER COLUMN "shareToken" SET NOT NULL;

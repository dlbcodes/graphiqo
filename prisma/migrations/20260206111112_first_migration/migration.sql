/*
  Warnings:

  - You are about to drop the column `stripePriceId` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `trialEndsAt` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `waitlist` table. All the data in the column will be lost.
  - You are about to drop the column `notified` on the `waitlist` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `waitlist` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `waitlist` table. All the data in the column will be lost.
  - You are about to drop the `cta_links` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `page_links` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `social_links` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `video_cards` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."cta_links" DROP CONSTRAINT "cta_links_videoCardId_fkey";

-- DropForeignKey
ALTER TABLE "public"."page_links" DROP CONSTRAINT "page_links_pageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."pages" DROP CONSTRAINT "pages_profileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."social_links" DROP CONSTRAINT "social_links_pageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."video_cards" DROP CONSTRAINT "video_cards_pageId_fkey";

-- DropIndex
DROP INDEX "public"."profiles_stripeSubscriptionId_key";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "stripePriceId",
DROP COLUMN "stripeSubscriptionId",
DROP COLUMN "trialEndsAt",
ALTER COLUMN "subscriptionTier" SET DEFAULT 'free',
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "waitlist" DROP COLUMN "name",
DROP COLUMN "notified",
DROP COLUMN "status",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "public"."cta_links";

-- DropTable
DROP TABLE "public"."page_links";

-- DropTable
DROP TABLE "public"."pages";

-- DropTable
DROP TABLE "public"."social_links";

-- DropTable
DROP TABLE "public"."video_cards";

-- DropEnum
DROP TYPE "public"."ThumbnailType";

-- CreateTable
CREATE TABLE "brand_profiles" (
    "id" TEXT NOT NULL,
    "profileId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL DEFAULT '#4f39f6',
    "secondaryColor" TEXT,
    "fontFamily" TEXT NOT NULL DEFAULT 'Inter',
    "logoUrl" TEXT,

    CONSTRAINT "brand_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboards" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "profileId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charts" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "brandProfileId" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'bar',
    "rawData" JSONB NOT NULL,
    "config" JSONB NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "charts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dashboards_slug_key" ON "dashboards"("slug");

-- AddForeignKey
ALTER TABLE "brand_profiles" ADD CONSTRAINT "brand_profiles_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboards" ADD CONSTRAINT "dashboards_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charts" ADD CONSTRAINT "charts_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "dashboards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charts" ADD CONSTRAINT "charts_brandProfileId_fkey" FOREIGN KEY ("brandProfileId") REFERENCES "brand_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "cta_links" ADD COLUMN     "isNsfw" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "page_links" ADD COLUMN     "isNsfw" BOOLEAN NOT NULL DEFAULT false;

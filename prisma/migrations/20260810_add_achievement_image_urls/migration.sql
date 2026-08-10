-- AlterTable: add the new gallery column
ALTER TABLE "Achievement" ADD COLUMN "imageUrls" TEXT[] NOT NULL DEFAULT '{}';

-- Backfill: carry the existing single imageUrl into imageUrls as its first (only) entry
UPDATE "Achievement"
SET "imageUrls" = ARRAY["imageUrl"]
WHERE "imageUrl" IS NOT NULL;

-- AlterTable: drop the now-redundant single-image column
ALTER TABLE "Achievement" DROP COLUMN "imageUrl";

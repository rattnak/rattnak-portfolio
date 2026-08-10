-- AlterTable: images now live inline in `content` markdown (![]() and ```slideshow blocks),
-- so the separate imageUrls gallery column is no longer needed.
ALTER TABLE "Achievement" DROP COLUMN "imageUrls";

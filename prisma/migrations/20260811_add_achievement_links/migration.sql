-- AlterTable: up to 3 labeled links per achievement, e.g.
-- [{"label": "Certificate", "url": "https://..."}, {"label": "Article", "url": "https://..."}].
-- The existing single-link `url` column stays as a legacy fallback;
-- see getAchievementLinks() in lib/database.ts.
ALTER TABLE "Achievement" ADD COLUMN "links" JSONB;

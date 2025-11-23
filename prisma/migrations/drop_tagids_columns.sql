-- Drop views that depend on tagIds columns
DROP VIEW IF EXISTS "AchievementsWithTags" CASCADE;
DROP VIEW IF EXISTS "ProjectsWithTags" CASCADE;
DROP VIEW IF EXISTS "BlogPostsWithTags" CASCADE;

-- Drop the tagIds columns
ALTER TABLE "Project" DROP COLUMN IF EXISTS "tagIds";
ALTER TABLE "Achievement" DROP COLUMN IF EXISTS "tagIds";
ALTER TABLE "BlogPost" DROP COLUMN IF EXISTS "tagIds";

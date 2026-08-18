-- Steps 2-4 of docs/WORK_TABLE_MIGRATION.md: create Work, copy Project and
-- Achievement into it, and flatten skills off the tag junctions.
--
-- Additive only. Project, Achievement, and the tag tables are left intact and
-- readable, so the running site keeps serving from them throughout. Nothing
-- here drops a table or discards a row; the destructive steps (6 and 8) are
-- deliberately not part of this migration.

-- Step 2: the category vocabulary and the table.
DO $$ BEGIN
  CREATE TYPE "WorkCategory" AS ENUM ('DEVELOP', 'OPEN_SOURCE', 'DESIGN', 'LEADERSHIP');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "Work" (
  "id"          SERIAL PRIMARY KEY,
  "slug"        TEXT NOT NULL UNIQUE,
  "name"        TEXT NOT NULL,
  "categories"  "WorkCategory"[] NOT NULL DEFAULT ARRAY['DEVELOP']::"WorkCategory"[],
  "skills"      TEXT[] NOT NULL DEFAULT '{}',
  "kind"        TEXT,
  "cardBlurb"   TEXT,
  "tldr"        TEXT NOT NULL,
  "content"     TEXT,
  "outcome"     TEXT,
  "organizer"   TEXT,
  "startDate"   TIMESTAMP(3) NOT NULL,
  "endDate"     TIMESTAMP(3),
  "githubUrl"   TEXT,
  "links"       JSONB,
  "imageUrl"    TEXT,
  "featured"    BOOLEAN NOT NULL DEFAULT false,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- A row with no category would vanish from every filter chip on the grid.
  CONSTRAINT "Work_categories_not_empty" CHECK (array_length("categories", 1) >= 1),
  -- Temporary, so step 3 can join back to ProjectTag. Dropped in step 8.
  "legacy_project_id" INTEGER
);

CREATE INDEX IF NOT EXISTS "idx_work_slug"       ON "Work" ("slug");
CREATE INDEX IF NOT EXISTS "idx_work_featured"   ON "Work" ("featured");
CREATE INDEX IF NOT EXISTS "idx_work_startdate"  ON "Work" ("startDate");
CREATE INDEX IF NOT EXISTS "idx_work_categories" ON "Work" USING GIN ("categories");
CREATE INDEX IF NOT EXISTS "idx_work_skills"     ON "Work" USING GIN ("skills");

-- Step 3: projects. All 8 rows are CODING today, which maps to {DEVELOP};
-- CASE_STUDY would map to {DESIGN}. description -> tldr, excerpt -> cardBlurb
-- (it already served exactly that role), overview -> content.
--
-- Project.url and liveUrl fold into links as labeled entries. Both are
-- preserved rather than dropped: url is NOT NULL today, so every row
-- contributes at least one entry.
INSERT INTO "Work" (
  "slug","name","categories","kind","cardBlurb","tldr","content","outcome",
  "organizer","startDate","endDate","githubUrl","links","imageUrl","featured",
  "createdAt","legacy_project_id"
)
SELECT
  p."slug",
  p."name",
  CASE p."type"::text
    WHEN 'CASE_STUDY' THEN ARRAY['DESIGN']::"WorkCategory"[]
    ELSE ARRAY['DEVELOP']::"WorkCategory"[]
  END,
  NULL,
  p."excerpt",
  p."description",
  p."overview",
  NULL, -- Project has no outcome column; lib/database.ts reads p.outcome and
        -- gets undefined for every row today. Left null here rather than
        -- inventing values; it is content to fill in during step 7.
  NULL,
  p."startDate",
  p."endDate",
  p."githubUrl",
  NULLIF(
    COALESCE(
      CASE WHEN p."url"     IS NOT NULL AND p."url"     <> '' THEN jsonb_build_array(jsonb_build_object('label','Project',  'url',p."url"))     ELSE '[]'::jsonb END ||
      CASE WHEN p."liveUrl" IS NOT NULL AND p."liveUrl" <> '' THEN jsonb_build_array(jsonb_build_object('label','Live site','url',p."liveUrl")) ELSE '[]'::jsonb END,
      '[]'::jsonb
    ),
    '[]'::jsonb
  ),
  p."imageUrl",
  p."featured",
  p."createdAt",
  p."id"
FROM "Project" p
WHERE NOT EXISTS (SELECT 1 FROM "Work" w WHERE w."slug" = p."slug");

-- Flatten ProjectTag into the skills array.
UPDATE "Work" w SET "skills" = COALESCE((
  SELECT ARRAY_AGG(t."name" ORDER BY t."name")
  FROM "ProjectTag" pt JOIN "Tag" t ON t."id" = pt."tagId"
  WHERE pt."projectId" = w."legacy_project_id"
), '{}')
WHERE w."legacy_project_id" IS NOT NULL;

-- Step 4: achievements. date -> startDate with endDate null (point-in-time),
-- result -> outcome, type -> kind, description -> tldr. Categories start as
-- {LEADERSHIP}, matching today's grid behavior exactly; step 7 assigns the
-- real multi-category values as a reviewed content pass.
--
-- Achievements have no excerpt, so cardBlurb stays null and the card falls
-- back to tldr. Skills come straight from the legacy tags array, which is
-- already the target shape.
INSERT INTO "Work" (
  "slug","name","categories","skills","kind","cardBlurb","tldr","content",
  "outcome","organizer","startDate","endDate","githubUrl","links","imageUrl",
  "featured","createdAt","legacy_project_id"
)
SELECT
  a."slug",
  a."name",
  ARRAY['LEADERSHIP']::"WorkCategory"[],
  COALESCE(a."tags", '{}'),
  a."type",
  NULL,
  a."description",
  a."content",
  a."result",
  a."organizer",
  a."date",
  NULL,
  NULL,
  -- Achievement.links is already the [{label,url}] shape. A bare url column
  -- is appended as one more labeled entry when present.
  NULLIF(
    COALESCE(a."links", '[]'::jsonb) ||
    CASE WHEN a."url" IS NOT NULL AND a."url" <> ''
      THEN jsonb_build_array(jsonb_build_object('label','Link','url',a."url"))
      ELSE '[]'::jsonb END,
    '[]'::jsonb
  ),
  a."imageUrl",
  a."featured",
  a."createdAt",
  NULL
FROM "Achievement" a
WHERE NOT EXISTS (SELECT 1 FROM "Work" w WHERE w."slug" = a."slug");

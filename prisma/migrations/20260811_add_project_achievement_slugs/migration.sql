-- Slug URL identity for Project and Achievement, replacing numeric ids
-- in /projects/[slug] and /achievements/[slug]. Mirrors the pattern
-- BlogPost already uses.
--
-- Order matters: add the column nullable, backfill every row with a
-- unique value, and only then apply NOT NULL and the unique index.
-- Adding the constraint first would fail on the existing rows.

ALTER TABLE "Project" ADD COLUMN "slug" TEXT;
ALTER TABLE "Achievement" ADD COLUMN "slug" TEXT;

-- Slugify matches projectNameToSlug() in lib/database.ts: lowercase,
-- every run of non-alphanumerics collapsed to a single hyphen, then
-- leading/trailing hyphens trimmed.
--
-- The row_number() suffix is the collision guard. Two projects that
-- slugify to the same string (duplicate names, or names differing only
-- in punctuation) would otherwise break the unique index. The oldest
-- row by id keeps the clean slug; later ones get -2, -3, and so on.
WITH slugged AS (
  SELECT
    id,
    trim(BOTH '-' FROM regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g')) AS base
  FROM "Project"
),
numbered AS (
  SELECT
    id,
    base,
    row_number() OVER (PARTITION BY base ORDER BY id) AS n
  FROM slugged
)
UPDATE "Project" p
SET "slug" = CASE
  -- A name with no alphanumerics at all slugifies to an empty string;
  -- fall back to the id so the row still gets a usable, unique value.
  WHEN numbered.base = '' THEN 'project-' || numbered.id::text
  WHEN numbered.n = 1 THEN numbered.base
  ELSE numbered.base || '-' || numbered.n::text
END
FROM numbered
WHERE p.id = numbered.id;

WITH slugged AS (
  SELECT
    id,
    trim(BOTH '-' FROM regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g')) AS base
  FROM "Achievement"
),
numbered AS (
  SELECT
    id,
    base,
    row_number() OVER (PARTITION BY base ORDER BY id) AS n
  FROM slugged
)
UPDATE "Achievement" a
SET "slug" = CASE
  WHEN numbered.base = '' THEN 'achievement-' || numbered.id::text
  WHEN numbered.n = 1 THEN numbered.base
  ELSE numbered.base || '-' || numbered.n::text
END
FROM numbered
WHERE a.id = numbered.id;

ALTER TABLE "Project" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "Achievement" ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
CREATE UNIQUE INDEX "Achievement_slug_key" ON "Achievement"("slug");

CREATE INDEX "idx_project_slug" ON "Project"("slug");
CREATE INDEX "idx_achievement_slug" ON "Achievement"("slug");

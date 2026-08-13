-- Project.type moves from the CODING / CASE_STUDY vocabulary to the four
-- work categories the home-page grid already filters by (WorkCategory in
-- lib/database.ts), and becomes multi-valued: one project can be both
-- DEVELOP and OPEN_SOURCE, and show up under either filter chip.
--
-- The two existing values are renamed rather than dropped and recreated,
-- so every existing row keeps its category with no data migration:
-- CODING -> DEVELOP, CASE_STUDY -> DESIGN. RENAME VALUE rewrites the label
-- in place, leaving the enum's internal sort order and the stored rows
-- untouched.

-- RenameEnumValues
ALTER TYPE "ProjectType" RENAME VALUE 'CODING' TO 'DEVELOP';
ALTER TYPE "ProjectType" RENAME VALUE 'CASE_STUDY' TO 'DESIGN';

-- AddEnumValues
-- Postgres cannot use a newly added enum value in the same transaction
-- that adds it, and the backfill below only ever writes DEVELOP/DESIGN
-- (both pre-existing), so this ordering is safe.
ALTER TYPE "ProjectType" ADD VALUE IF NOT EXISTS 'OPEN_SOURCE';
ALTER TYPE "ProjectType" ADD VALUE IF NOT EXISTS 'LEADERSHIP';

-- AlterTable
-- Single enum -> enum array. USING wraps each existing scalar in a
-- one-element array, so a row that was CODING becomes {DEVELOP}. The old
-- default is dropped first because 'DEVELOP'::"ProjectType" is not a valid
-- default for an array column.
ALTER TABLE "Project" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Project"
  ALTER COLUMN "type" TYPE "ProjectType"[]
  USING ARRAY["type"];
ALTER TABLE "Project" ALTER COLUMN "type" SET DEFAULT ARRAY['DEVELOP']::"ProjectType"[];

-- No row should carry an empty category list: an uncategorized project
-- would silently vanish from every filter chip on the grid.
ALTER TABLE "Project"
  ADD CONSTRAINT "Project_type_not_empty" CHECK (array_length("type", 1) >= 1);

-- Organizing body behind the work, same nullable-text contract as
-- Achievement.organizer. A LEADERSHIP or OPEN_SOURCE project had nowhere
-- to record the host org; personal projects leave it null.
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "organizer" TEXT;

-- The btree index on the old scalar column cannot serve array containment
-- queries (type @> ARRAY['DEVELOP']). GIN is the right access method here.
DROP INDEX IF EXISTS "idx_project_type";
CREATE INDEX "idx_project_type" ON "Project" USING GIN ("type");
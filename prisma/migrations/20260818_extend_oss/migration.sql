-- Step 5 of docs/WORK_TABLE_MIGRATION.md: extend OpenSourceContribution in
-- place. No row changes: all 12 PR rows stay, still grouped by projectName in
-- code, so mergedCount / totalCount and the PR list keep working untouched.

-- Skills: the capability open source never had. It has no tag junction at
-- all today, so this starts empty and is filled in as content work. Grouped
-- cards union the skills of their contributions.
ALTER TABLE "OpenSourceContribution" ADD COLUMN IF NOT EXISTS "skills" TEXT[] NOT NULL DEFAULT '{}';

-- Labeled links, same shape and same amber treatment as Work.links.
ALTER TABLE "OpenSourceContribution" ADD COLUMN IF NOT EXISTS "links" JSONB;

-- Fold liveUrl into links as one labeled entry before dropping it. Verified
-- at migration time: 0 rows have a non-null liveUrl, so this moves no data
-- and the column drop loses nothing. The UPDATE is kept anyway so the
-- migration stays correct if run against a database where rows do have one.
UPDATE "OpenSourceContribution"
   SET "links" = jsonb_build_array(jsonb_build_object('label','Live site','url',"liveUrl"))
 WHERE "liveUrl" IS NOT NULL
   AND "liveUrl" <> ''
   AND "links" IS NULL;

ALTER TABLE "OpenSourceContribution" DROP COLUMN IF EXISTS "liveUrl";

-- Align the repo column with Work.githubUrl so both tables render the teal
-- repo link from the same field name.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='OpenSourceContribution' AND column_name='repoUrl')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='OpenSourceContribution' AND column_name='githubUrl')
  THEN
    ALTER TABLE "OpenSourceContribution" RENAME COLUMN "repoUrl" TO "githubUrl";
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "idx_oss_skills" ON "OpenSourceContribution" USING GIN ("skills");

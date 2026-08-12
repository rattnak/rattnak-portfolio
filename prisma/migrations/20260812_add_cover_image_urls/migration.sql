-- Card covers for the two work types that had no image field.
-- Project.imageUrl already existed; this brings Achievement and
-- OpenSourceContribution onto the same contract so getWorkItems reads
-- one field for all three instead of scraping markdown for achievements
-- and giving open source no option at all.
--
-- Nullable with no default and no backfill: every row keeps rendering
-- its existing fallback (first content image, then typography) until a
-- cover is actually set.

ALTER TABLE "Achievement" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "OpenSourceContribution" ADD COLUMN "imageUrl" TEXT;

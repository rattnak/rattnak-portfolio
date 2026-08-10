-- AlterTable: live/deployed site URL for the project (e.g. openlibrary.org),
-- distinct from repoUrl (source) and prUrl (a specific pull request).
ALTER TABLE "OpenSourceContribution" ADD COLUMN "liveUrl" TEXT;

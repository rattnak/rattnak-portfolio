-- CreateTable
CREATE TABLE "OpenSourceContribution" (
    "id" SERIAL NOT NULL,
    "projectName" TEXT NOT NULL,
    "organization" TEXT,
    "description" TEXT NOT NULL,
    "prUrl" TEXT,
    "repoUrl" TEXT,
    "merged" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpenSourceContribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_oss_date" ON "OpenSourceContribution"("date");

-- CreateIndex
CREATE INDEX "idx_oss_featured" ON "OpenSourceContribution"("featured");


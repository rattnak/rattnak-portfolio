-- ========================================
-- PORTFOLIO DATABASE SETUP
-- Run this entire file in Supabase SQL Editor
-- ========================================

-- Drop existing tables if they exist (CAREFUL: This deletes all data!)
DROP TABLE IF EXISTS "BlogPost" CASCADE;
DROP TABLE IF EXISTS "Competition" CASCADE;
DROP TABLE IF EXISTS "Project" CASCADE;
DROP TYPE IF EXISTS "ProjectType" CASCADE;

-- Create ProjectType Enum
CREATE TYPE "ProjectType" AS ENUM ('CODING', 'CASE_STUDY');

-- Create Project Table
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "ProjectType" NOT NULL DEFAULT 'CODING',
    "tags" TEXT[],
    "imageUrl" TEXT,
    "githubUrl" TEXT,
    "liveUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- Create Competition Table
CREATE TABLE "Competition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "result" TEXT NOT NULL,
    "organizer" TEXT,
    "imageUrl" TEXT,
    "url" TEXT,
    "tags" TEXT[],
    "date" TIMESTAMP(3) NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);

-- Create BlogPost Table
CREATE TABLE "BlogPost" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "tags" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "readTime" INTEGER,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- Create Indexes
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
CREATE INDEX "idx_project_featured" ON "Project"("featured");
CREATE INDEX "idx_project_type" ON "Project"("type");
CREATE INDEX "idx_competition_featured" ON "Competition"("featured");
CREATE INDEX "idx_competition_date" ON "Competition"("date");
CREATE INDEX "idx_blogpost_published" ON "BlogPost"("published");
CREATE INDEX "idx_blogpost_slug" ON "BlogPost"("slug");

-- Verify tables were created
SELECT 'Tables created successfully!' as message;
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('Project', 'Competition', 'BlogPost');

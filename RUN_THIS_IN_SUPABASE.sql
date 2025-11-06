-- ========================================
-- PORTFOLIO DATABASE SETUP
-- Run this entire file in Supabase SQL Editor
-- This script creates the database schema for your portfolio
-- ========================================

-- Only drop tables if you want to start fresh (CAREFUL: This deletes all data!)
-- Uncomment the following lines if you want to reset your database:
-- DROP TABLE IF EXISTS "BlogPost" CASCADE;
-- DROP TABLE IF EXISTS "Competition" CASCADE;
-- DROP TABLE IF EXISTS "Project" CASCADE;
-- DROP TYPE IF EXISTS "ProjectType" CASCADE;

-- Create ProjectType Enum (only if it doesn't exist)
DO $$ BEGIN
    CREATE TYPE "ProjectType" AS ENUM ('CODING', 'CASE_STUDY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Project Table
CREATE TABLE IF NOT EXISTS "Project" (
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
CREATE TABLE IF NOT EXISTS "Competition" (
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
CREATE TABLE IF NOT EXISTS "BlogPost" (
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

-- Create Indexes (only if they don't exist)
CREATE UNIQUE INDEX IF NOT EXISTS "BlogPost_slug_key" ON "BlogPost"("slug");
CREATE INDEX IF NOT EXISTS "idx_project_featured" ON "Project"("featured");
CREATE INDEX IF NOT EXISTS "idx_project_type" ON "Project"("type");
CREATE INDEX IF NOT EXISTS "idx_competition_featured" ON "Competition"("featured");
CREATE INDEX IF NOT EXISTS "idx_competition_date" ON "Competition"("date");
CREATE INDEX IF NOT EXISTS "idx_blogpost_published" ON "BlogPost"("published");
CREATE INDEX IF NOT EXISTS "idx_blogpost_slug" ON "BlogPost"("slug");

-- Verify tables were created
SELECT 'Tables created successfully!' as message;
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('Project', 'Competition', 'BlogPost');

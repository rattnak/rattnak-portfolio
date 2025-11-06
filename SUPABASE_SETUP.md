# Supabase Database Setup Guide

This guide will help you set up your Supabase database for the portfolio project.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Your Supabase project created

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (or create a new one)
3. Go to **Settings** → **Database**
4. Copy the **Connection string** and note the password
5. Go to **Settings** → **API**
6. Copy:
   - **Project URL** (for `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## Step 2: Update Environment Variables

Update your `.env` file with the correct values:

```env
# Database Connection (Supabase)
# Format: postgresql://postgres.[PROJECT_REF]:[YOUR_PASSWORD]@[HOST]:[PORT]/postgres
DATABASE_URL="postgresql://postgres.frsnagyvywoulauzvekc:[YOUR_PASSWORD]@aws-1-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection for migrations (use port 5432)
DIRECT_URL="postgresql://postgres.frsnagyvywoulauzvekc:[YOUR_PASSWORD]@aws-1-us-west-1.pooler.supabase.com:5432/postgres"

# Supabase Client Configuration
NEXT_PUBLIC_SUPABASE_URL="https://frsnagyvywoulauzvekc.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc... (your anon key)"
```

**Important:** Replace `[YOUR_PASSWORD]` with your actual Supabase database password.

## Step 3: Run Database Migration

### Option A: Using Prisma CLI (Recommended)

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed the database (optional)
npx prisma db seed
```

### Option B: Manual SQL Execution

If the Prisma migration fails, you can run the SQL directly in Supabase:

1. Go to your Supabase Dashboard → **SQL Editor**
2. Copy and paste the SQL from `prisma/migrations/init/migration.sql` (see below)
3. Click **Run**

## Step 4: Database Schema (SQL)

Here's the complete SQL schema to create your tables:

```sql
-- Create Project Type Enum
CREATE TYPE "ProjectType" AS ENUM ('CODING', 'CASE_STUDY');

-- Create Project Table
CREATE TABLE "Project" (
    "id" SERIAL PRIMARY KEY,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Competition Table
CREATE TABLE "Competition" (
    "id" SERIAL PRIMARY KEY,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create BlogPost Table
CREATE TABLE "BlogPost" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "tags" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "readTime" INTEGER,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create Indexes
CREATE INDEX "idx_project_featured" ON "Project"("featured");
CREATE INDEX "idx_project_type" ON "Project"("type");
CREATE INDEX "idx_competition_featured" ON "Competition"("featured");
CREATE INDEX "idx_competition_date" ON "Competition"("date");
CREATE INDEX "idx_blogpost_published" ON "BlogPost"("published");
CREATE INDEX "idx_blogpost_slug" ON "BlogPost"("slug");
```

## Step 5: Seed Sample Data (Optional)

Run this SQL to add sample data:

```sql
-- Insert Sample Projects
INSERT INTO "Project" ("name", "description", "url", "type", "tags", "imageUrl", "githubUrl", "liveUrl", "featured", "startDate", "endDate") VALUES
('Portfolio Website', 'Personal portfolio built with Next.js, Prisma, and Tailwind CSS', 'https://github.com/yourusername/portfolio', 'CODING', ARRAY['Next.js', 'TypeScript', 'Prisma', 'Tailwind CSS'], '/img/projects/portfolio.png', 'https://github.com/yourusername/portfolio', 'https://yourportfolio.com', true, '2025-01-01', '2025-03-01'),
('E-Commerce Platform', 'Full-stack e-commerce platform with payment integration', 'https://github.com/yourusername/ecommerce', 'CODING', ARRAY['React', 'Node.js', 'MongoDB', 'Stripe'], '/img/projects/ecommerce.png', 'https://github.com/yourusername/ecommerce', 'https://demo-ecommerce.com', true, '2024-08-01', '2024-11-01');

-- Insert Sample Competitions
INSERT INTO "Competition" ("name", "type", "description", "content", "result", "organizer", "imageUrl", "url", "tags", "date", "featured") VALUES
('HackMIT 2024', 'Hackathon', 'Built an AI-powered study assistant that won 1st place', 'Full competition details here...', '1st Place', 'MIT', '/img/competitions/hackmit.png', 'https://devpost.com/your-project', ARRAY['AI', 'Machine Learning', 'React', 'Python'], '2024-09-15', true);

-- Insert Sample Blog Posts
INSERT INTO "BlogPost" ("title", "slug", "excerpt", "content", "coverImage", "tags", "published", "readTime", "publishedAt", "updatedAt") VALUES
('My Journey into Software Engineering', 'journey-into-software-engineering', 'Reflecting on my path from beginner to building production applications', 'Full blog content here...', '/img/blog/journey.jpg', ARRAY['Career', 'Reflection', 'Learning'], true, 5, '2025-03-01', NOW());
```

## Step 6: Verify Connection

Test your database connection:

```bash
# Check database connection
npx prisma db pull

# Generate Prisma Client
npx prisma generate
```

## Step 7: Update Data Fetching Functions

Replace mock data imports with real database queries in your components:

```typescript
// Example: lib/projects.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProjects() {
  return prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}
```

## Troubleshooting

### Authentication Error

If you get `P1000: Authentication failed`:
- Double-check your password in the connection string
- Ensure you're using the correct project reference
- Try resetting your database password in Supabase Dashboard

### Connection Timeout

If migrations timeout:
- Use the SQL Editor in Supabase Dashboard to run the SQL directly
- Check your network/firewall settings

### Migration Already Exists

If you see "migration already exists":
```bash
# Reset migrations (CAUTION: This will drop all data!)
npx prisma migrate reset

# Or create a new migration
npx prisma migrate dev --name add_your_changes
```

## Next Steps

1. Update your password in `.env`
2. Run the migration
3. Replace `mockData` imports with database queries
4. Test your application
5. Deploy to production

## Resources

- [Prisma with Supabase Guide](https://supabase.com/docs/guides/integrations/prisma)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Supabase Documentation](https://supabase.com/docs)

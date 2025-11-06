# Database Setup Guide

This guide will help you set up the Supabase database for your portfolio.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project created
3. Your Supabase URL and anon key

## Step 1: Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
DATABASE_URL=your_database_url_here
DIRECT_URL=your_direct_url_here

# Clerk (if using authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
CLERK_SECRET_KEY=your_clerk_secret_here
```

## Step 2: Run the SQL Script

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the entire contents of `RUN_THIS_IN_SUPABASE.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the script

This will create three tables:
- `Project` - For your development and design projects
- `Competition` - For your achievements and awards
- `BlogPost` - For your blog articles

## Step 3: Add Your Data

You can add data to your database in two ways:

### Option A: Using the Supabase Dashboard

1. Go to the Table Editor in your Supabase dashboard
2. Select a table (Project, Competition, or BlogPost)
3. Click "Insert row" to add new entries manually

### Option B: Using SQL Inserts

Here are examples of how to insert data:

#### Insert a Project

```sql
INSERT INTO "Project" (
  "name",
  "description",
  "url",
  "type",
  "tags",
  "imageUrl",
  "githubUrl",
  "liveUrl",
  "featured",
  "startDate",
  "endDate"
) VALUES (
  'My Awesome Project',
  'A detailed description of the project',
  '/projects/1',
  'CODING',
  ARRAY['React', 'Next.js', 'TypeScript'],
  'https://example.com/image.jpg',
  'https://github.com/username/repo',
  'https://example.com',
  true,
  '2024-01-01',
  '2024-06-01'
);
```

#### Insert an Achievement

```sql
INSERT INTO "Competition" (
  "name",
  "type",
  "description",
  "content",
  "result",
  "organizer",
  "imageUrl",
  "url",
  "tags",
  "date",
  "featured"
) VALUES (
  'Hackathon Winner',
  'Hackathon',
  'Won first place at XYZ Hackathon',
  'Detailed content about the achievement',
  '1st Place',
  'XYZ Organization',
  'https://example.com/certificate.jpg',
  'https://example.com/competition',
  ARRAY['Hackathon', 'Winner', 'Innovation'],
  '2024-03-15',
  true
);
```

#### Insert a Blog Post

```sql
INSERT INTO "BlogPost" (
  "title",
  "slug",
  "excerpt",
  "content",
  "coverImage",
  "tags",
  "published",
  "readTime",
  "publishedAt",
  "updatedAt"
) VALUES (
  'My First Blog Post',
  'my-first-blog-post',
  'A short excerpt of the blog post',
  '# Full Blog Content\n\nMarkdown content goes here...',
  'https://example.com/cover.jpg',
  ARRAY['Tutorial', 'Web Development'],
  true,
  5,
  NOW(),
  NOW()
);
```

## Step 4: Verify the Setup

After adding data, visit your deployed website to verify everything is working correctly:

- Homepage should show featured projects and achievements
- `/projects` should list all your projects
- `/achievements` should list all your achievements
- `/blog` should list all published blog posts

## Database Schema

### Project Table

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| id | Serial | Auto | Unique identifier |
| name | Text | Yes | Project name |
| description | Text | Yes | Project description |
| url | Text | Yes | Internal URL path |
| type | Enum | Yes | 'CODING' or 'CASE_STUDY' |
| tags | Array | No | Technology/category tags |
| imageUrl | Text | No | Cover image URL |
| githubUrl | Text | No | GitHub repository URL |
| liveUrl | Text | No | Live demo URL |
| featured | Boolean | No | Show on homepage? |
| startDate | Timestamp | Yes | Project start date |
| endDate | Timestamp | No | Project end date |
| createdAt | Timestamp | Auto | Creation timestamp |

### Competition Table

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| id | Serial | Auto | Unique identifier |
| name | Text | Yes | Achievement name |
| type | Text | Yes | Type (e.g., "Hackathon", "Award") |
| description | Text | Yes | Short description |
| content | Text | No | Detailed content (Markdown) |
| result | Text | Yes | Result (e.g., "1st Place") |
| organizer | Text | No | Organizing body |
| imageUrl | Text | No | Certificate/image URL |
| url | Text | No | External URL |
| tags | Array | No | Category tags |
| date | Timestamp | Yes | Achievement date |
| featured | Boolean | No | Show on homepage? |
| createdAt | Timestamp | Auto | Creation timestamp |

### BlogPost Table

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| id | Serial | Auto | Unique identifier |
| title | Text | Yes | Post title |
| slug | Text | Yes | URL slug (unique) |
| excerpt | Text | Yes | Short excerpt |
| content | Text | Yes | Full content (Markdown) |
| coverImage | Text | No | Cover image URL |
| tags | Array | No | Category tags |
| published | Boolean | No | Is published? |
| readTime | Integer | No | Estimated read time (minutes) |
| publishedAt | Timestamp | No | Publication date |
| createdAt | Timestamp | Auto | Creation timestamp |
| updatedAt | Timestamp | Auto | Last update timestamp |

## Troubleshooting

### Error: "relation already exists"

This means the tables are already created. You can either:
1. Skip this error (tables are already set up)
2. Uncomment the DROP statements in the SQL script to reset everything (WARNING: This deletes all data)

### Error: "Missing environment variables"

Make sure your `.env.local` file has all required variables and restart your development server.

### Data not showing on website

1. Check that `featured` is set to `true` for items you want on the homepage
2. For blog posts, ensure `published` is `true` and `publishedAt` is set
3. Verify your Supabase URL and keys are correct in `.env.local`

## Support

If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Verify all environment variables are set correctly
3. Ensure the SQL script ran without errors

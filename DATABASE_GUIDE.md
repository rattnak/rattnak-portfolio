# Database Setup & Management Guide

## Current Status

Your portfolio is fully set up with the following structure:
- ✅ Database schema defined in `prisma/schema.prisma`
- ✅ Prisma Client generated
- ✅ Sample seed data prepared
- ⏳ Database migration pending (waiting for database connection)

## When Your Database Is Available

### Step 1: Wake Up Your Supabase Database
1. Visit your [Supabase Dashboard](https://supabase.com/dashboard)
2. Click on your project
3. The database should wake up automatically

### Step 2: Push Schema to Database

```bash
npm run db:push
```

This command will:
- Connect to your Supabase database
- Create all tables (Project, Competition, BlogPost)
- Set up relationships and constraints

### Step 3: Seed with Sample Data

```bash
npm run db:seed
```

This will populate your database with:
- 4 sample projects (2 coding, 2 case studies)
- 3 competitions/achievements
- 3 blog posts

### Step 4: View Your Data

```bash
npm run db:studio
```

This opens Prisma Studio at http://localhost:5555 where you can:
- View all your data
- Add/edit/delete records visually
- Test queries

## Alternative: Manual Migration

If you prefer traditional migrations:

```bash
npx prisma migrate dev --name init_portfolio
```

## Troubleshooting

### "Can't reach database server"

**Solutions:**
1. Visit Supabase dashboard to wake up your database
2. Wait 30 seconds and try again
3. Check if DATABASE_URL in `.env` is correct

### "P3009: migrate found failed migration"

**Solution:**
```bash
npx prisma migrate reset
npm run db:push
npm run db:seed
```

### TypeScript errors after schema changes

**Solution:**
```bash
npx prisma generate
```

## Database Models

### Project
- Supports both **CODING** and **CASE_STUDY** types
- Featured projects get highlighted
- Optional fields: images, GitHub URL, live URL
- Tags for tech stack or design tools

### Competition
- For hackathons, competitions, awards
- Result field (e.g., "1st Place", "Winner")
- Optional organizer and images
- Featured flag for highlights

### BlogPost
- Full markdown support in content field
- Published/draft status
- Slug for URLs (must be unique)
- Tags for categorization
- Read time in minutes

## Common Tasks

### Add a new project via code:

```typescript
// In a server component or API route
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

await prisma.project.create({
  data: {
    name: "My Awesome Project",
    description: "A cool project I built",
    url: "https://github.com/user/project",
    type: "CODING",
    tags: ["React", "Node.js"],
    startDate: new Date(),
    featured: true,
  }
});
```

### Query projects by type:

```typescript
// Get only coding projects
const codingProjects = await prisma.project.findMany({
  where: { type: "CODING" }
});

// Get only case studies
const caseStudies = await prisma.project.findMany({
  where: { type: "CASE_STUDY" }
});
```

## Development Workflow

1. Make changes to `prisma/schema.prisma`
2. Run `npx prisma generate` to update types
3. Run `npm run db:push` to sync with database
4. Update your queries in `lib/` files if needed

## Production Deployment

Before deploying:
```bash
npx prisma migrate deploy
```

This applies migrations without prompting for confirmations.

---

**Need Help?** Check out:
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- Your `SETUP.md` file for more examples

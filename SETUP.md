# Portfolio Setup Guide

## Database Setup

### Option 1: Using Prisma Push (Recommended for Development)
When your Supabase database is running, use:
```bash
npx prisma db push
```

This will sync your schema without creating migration files.

### Option 2: Using Migrations (Recommended for Production)
```bash
npx prisma migrate dev --name init_portfolio
```

## After Database is Synced

1. **Verify the tables were created:**
   ```bash
   npx prisma studio
   ```
   This opens a visual database browser at http://localhost:5555

2. **Add sample data** (see examples below)

## Sample Data Examples

### Adding a Coding Project
```typescript
// In Prisma Studio or via your app
{
  name: "Portfolio Website",
  description: "Personal portfolio built with Next.js, Prisma, and Tailwind CSS",
  url: "https://github.com/yourusername/portfolio",
  type: "CODING",
  tags: ["Next.js", "TypeScript", "Prisma", "Tailwind CSS"],
  imageUrl: "/img/projects/portfolio.png",
  githubUrl: "https://github.com/yourusername/portfolio",
  liveUrl: "https://yourportfolio.com",
  featured: true,
  startDate: "2025-01-01T00:00:00Z",
  endDate: "2025-03-01T00:00:00Z"
}
```

### Adding a Case Study (Figma Prototype)
```typescript
{
  name: "Mobile Banking App Redesign",
  description: "Complete UX/UI redesign of a mobile banking application",
  url: "https://figma.com/file/your-design",
  type: "CASE_STUDY",
  tags: ["Figma", "UI/UX", "Mobile Design", "User Research"],
  imageUrl: "/img/projects/banking-app.png",
  githubUrl: null,
  liveUrl: null,
  featured: true,
  startDate: "2024-10-01T00:00:00Z",
  endDate: "2024-12-01T00:00:00Z"
}
```

### Adding a Competition/Achievement
```typescript
{
  name: "HackMIT 2024",
  type: "Hackathon",
  description: "Built an AI-powered study assistant that won 1st place",
  result: "1st Place",
  organizer: "MIT",
  imageUrl: "/img/competitions/hackmit.png",
  url: "https://devpost.com/your-project",
  date: "2024-09-15T00:00:00Z",
  featured: true
}
```

### Adding a Blog Post
```typescript
{
  title: "My Journey into Software Engineering",
  slug: "journey-into-software-engineering",
  excerpt: "Reflecting on my path from beginner to building production apps",
  content: "# My Journey\n\nThis is the full markdown content...",
  coverImage: "/img/blog/journey.jpg",
  tags: ["Career", "Reflection", "Learning"],
  published: true,
  readTime: 5,
  publishedAt: "2025-03-01T00:00:00Z"
}
```

## File Structure

```
rattnak-portfolio/
├── app/
│   ├── layout.tsx          # Root layout with Navbar
│   └── page.tsx            # Home page with all sections
├── components/
│   ├── Hero.tsx            # Hero section
│   ├── Services.tsx        # Services section
│   ├── Projects.tsx        # Projects section (server)
│   ├── ProjectsClient.tsx  # Projects filtering (client)
│   ├── ProjectCard.tsx     # Individual project card
│   ├── Competitions.tsx    # Competitions section
│   ├── CompetitionCard.tsx # Individual competition card
│   ├── BlogSection.tsx     # Blog preview section
│   ├── BlogCard.tsx        # Individual blog card
│   └── Navbar.tsx          # Navigation with all sections
├── lib/
│   ├── projects.ts         # Project database queries
│   ├── competitions.ts     # Competition queries
│   └── blogs.ts            # Blog queries
└── prisma/
    └── schema.prisma       # Database schema

## Troubleshooting

### Database Connection Issues
- Check if your Supabase project is active (free tier pauses after inactivity)
- Visit your Supabase dashboard to wake up the database
- Verify DATABASE_URL in .env is correct

### TypeScript Errors
After schema changes, always run:
```bash
npx prisma generate
```

### Missing Images
Place your images in:
- `/public/img/projects/` for project screenshots
- `/public/img/competitions/` for competition logos
- `/public/img/blog/` for blog cover images

## Development

```bash
npm run dev
```

Visit http://localhost:3000 to see your portfolio!

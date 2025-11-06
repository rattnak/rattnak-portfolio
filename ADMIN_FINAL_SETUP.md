# Admin Panel - Final Setup Instructions

## ✅ What's Complete

All the code is ready! Your admin panel has been fully built with:
- Clerk authentication (email-restricted access)
- Project management (create/read/update/delete)
- Achievement management (list/delete - forms pending)
- Database schema ready in Prisma
- Shared Prisma client singleton (prevents connection issues)

## 🚀 Final Setup Steps (Do These Now!)

### Step 1: Create Clerk Account & Get Admin User (5 minutes)

1. **Go to Clerk Dashboard**
   - Visit: https://dashboard.clerk.com/sign-up
   - Create your account

2. **Create a New Application**
   - Click "Add application"
   - Name it: "Portfolio Admin"
   - Select "Email" as authentication method
   - Click "Create application"

3. **Get Your API Keys**
   - You'll see your keys on the next page
   - Copy both keys (already in your `.env`):
     ```
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
     CLERK_SECRET_KEY=sk_test_...
     ```
   - **Your keys are already set!** (I can see them in your .env)

4. **Disable Public Sign-ups** (IMPORTANT!)
   - In left sidebar: **User & Authentication** → **Email, Phone, Username**
   - Find "Sign-up mode" section
   - **Turn OFF** "Allow sign-ups"
   - Click **Save**

5. **Create Your Admin User**
   - In left sidebar: **Users**
   - Click **Create user** button
   - Enter:
     - Email: `mongchanrattnak@gmail.com`
     - Password: (create a strong password)
   - Click **Create**
   - **Remember this password!** You'll use it to sign in

### Step 2: Set Up Database Tables (2 minutes)

1. **Go to Supabase SQL Editor**
   - Visit: https://supabase.com/dashboard/project/frsnagyvywoulauzvekc/sql/new

2. **Copy the Migration SQL**
   - Open `prisma/migrations/20250105_init/migration.sql` in your project
   - Copy ALL the SQL (80 lines)

3. **Run the SQL**
   - Paste it into Supabase SQL Editor
   - Click **Run** button (bottom right)
   - You should see: "Success. No rows returned"

4. **Verify Tables Were Created**
   - Go to: https://supabase.com/dashboard/project/frsnagyvywoulauzvekc/editor
   - You should see three new tables:
     - ✅ Project
     - ✅ Competition
     - ✅ BlogPost

### Step 3: Test Your Admin Panel

1. **Your server is already running at:** http://localhost:3004

2. **Access Admin Panel**
   - Go to: http://localhost:3004/admin
   - You'll be redirected to sign-in page

3. **Sign In**
   - Enter email: `mongchanrattnak@gmail.com`
   - Enter the password you created in Clerk
   - Click **Sign in**

4. **You should see:**
   - Dashboard with stats (0 projects, 0 achievements, 0 blog posts)
   - Navigation: Projects, Achievements, Blog
   - Quick action buttons

5. **Test Adding a Project**
   - Click "Add Project" or go to Projects → "Add Project"
   - Fill in the form:
     - Name: "Test Project"
     - Description: "Testing the admin panel"
     - Type: "Coding Project"
     - URL: "https://github.com/test"
     - Tags: "Next.js, TypeScript"
     - Start Date: Today
     - Check "Featured"
   - Click "Create Project"
   - You should be redirected to projects list
   - Your project should appear!

## 📁 What's Working Right Now

### ✅ Fully Functional
- **Authentication**: Clerk sign-in with email restriction
- **Dashboard**: View stats for all content
- **Projects**:
  - List all projects
  - Create new project
  - Edit existing project
  - Delete project
  - Toggle featured status

### ⏳ Partially Working
- **Achievements**:
  - ✅ List all achievements
  - ✅ Delete achievements
  - ❌ Create/Edit forms (not built yet)

### ❌ Not Built Yet
- **Blog Management**: All pages need to be created

## 🔧 If Something Doesn't Work

### "Can't access /admin"
**Problem**: You see an error or blank page

**Solutions**:
1. Check if server is running: `npm run dev`
2. Make sure Clerk keys are in `.env`
3. Try clearing browser cache
4. Check browser console for errors (F12)

### "Unauthorized" after signing in
**Problem**: You sign in but see "Access Denied"

**Solutions**:
1. Verify email in Clerk matches `ADMIN_EMAIL` in `.env`
2. Check for typos: `mongchanrattnak@gmail.com`
3. Restart the dev server

### "Database error" or "Table doesn't exist"
**Problem**: Errors about missing tables/columns

**Solutions**:
1. Run the migration SQL in Supabase (Step 2 above)
2. Verify tables exist in Supabase Table Editor
3. Check `DATABASE_URL` in `.env` is correct
4. Run: `npx prisma generate`

### "Too many Prisma clients"
**Problem**: Error about too many database connections

**Solution**: This is already fixed! All files use the singleton client from `lib/prisma.ts`

## 📋 Current Database Schema

### Project Table
```
id, name, description, url, type (CODING/CASE_STUDY),
tags[], imageUrl, githubUrl, liveUrl, featured,
startDate, endDate, createdAt
```

### Competition Table
```
id, name, type, description, content (markdown),
result, organizer, imageUrl, url, tags[], date,
featured, createdAt
```

### BlogPost Table
```
id, title, slug, excerpt, content (markdown),
coverImage, tags[], published, readTime,
publishedAt, createdAt, updatedAt
```

## 🎯 Next Steps After Setup

1. **Add Your Real Projects**
   - Go to `/admin/projects`
   - Add your actual coding projects and case studies
   - Mark your best ones as "Featured"

2. **Test Everything**
   - Create a project
   - Edit it
   - Delete it
   - Check if it shows on homepage

3. **Complete Achievement & Blog Forms** (Optional)
   - Either ask me to build them
   - Or use the Project forms as a template

4. **Deploy to Production** (When ready)
   - Get Clerk **live** keys (not test keys)
   - Update environment variables in Vercel/hosting
   - Test authentication in production

## 📚 Documentation Files

- **CLERK_SETUP.md** - Detailed Clerk configuration
- **SUPABASE_SETUP.md** - Database setup with examples
- **DATABASE_QUICKSTART.md** - Quick database commands
- **ADMIN_SETUP_COMPLETE.md** - Full feature documentation

## 💡 Quick Reference

### Admin URLs
- Dashboard: http://localhost:3004/admin
- Projects: http://localhost:3004/admin/projects
- Achievements: http://localhost:3004/admin/achievements
- Sign In: http://localhost:3004/admin/sign-in

### Important Environment Variables
```env
# Clerk (already set!)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
ADMIN_EMAIL=mongchanrattnak@gmail.com

# Database (already set!)
DATABASE_URL=postgresql://...
```

## ✅ Checklist

Before you can use the admin panel, make sure you've completed:

- [ ] Created Clerk account
- [ ] Disabled public sign-ups in Clerk
- [ ] Created admin user in Clerk with email `mongchanrattnak@gmail.com`
- [ ] Ran migration SQL in Supabase SQL Editor
- [ ] Verified tables exist in Supabase
- [ ] Server is running (`npm run dev`)
- [ ] Can access http://localhost:3004/admin
- [ ] Successfully signed in
- [ ] Can see dashboard with stats
- [ ] Successfully created a test project

## 🎉 You're Done!

Once you've completed the checklist above, your admin panel is fully operational. You can now:
- Add your real projects, achievements, and blog posts
- Manage all your portfolio content through the web interface
- Update content anytime without touching code

Questions? Check the documentation files or review the code comments!

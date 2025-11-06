# Admin Panel Setup - Complete Guide

## ✅ What's Been Set Up

### 1. Authentication with Clerk
- ✅ Clerk installed and configured
- ✅ Middleware protecting `/admin/*` routes
- ✅ Email-based access control (only `mongchanrattnak@gmail.com`)
- ✅ Sign-in page at `/admin/sign-in`
- ✅ Unauthorized page for non-admin users
- ✅ No public sign-ups (admin-only access)

### 2. Admin Dashboard
- ✅ Main dashboard at `/admin` showing stats
- ✅ Quick action cards for adding content
- ✅ Protected with authentication check
- ✅ Navigation to all sections

### 3. Project Management (COMPLETE)
- ✅ List all projects at `/admin/projects`
- ✅ Create new project at `/admin/projects/new`
- ✅ Edit project at `/admin/projects/[id]`
- ✅ Delete project with confirmation
- ✅ Form with all fields (name, description, type, tags, URLs, dates, featured)
- ✅ API routes for CRUD operations

### 4. Achievement Management (IN PROGRESS)
- ✅ List page created
- ⏳ Need to create form component
- ⏳ Need to create new/edit pages
- ⏳ Need to create API routes

### 5. Blog Management (TODO)
- ⏳ Need to create all pages
- ⏳ Need to create form with markdown editor
- ⏳ Need to create API routes

## 🚀 Quick Start

### Step 1: Set Up Clerk Authentication

1. **Create Clerk Account**
   - Go to https://dashboard.clerk.com/sign-up
   - Create a new application

2. **Get API Keys**
   - Go to **API Keys** in Clerk dashboard
   - Copy Publishable Key and Secret Key

3. **Update `.env`**
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_secret_key_here
   ```

4. **Disable Public Sign-ups**
   - In Clerk dashboard: **User & Authentication** → **Email, Phone, Username**
   - **Turn OFF** "Allow sign-ups"

5. **Create Your Admin Account**
   - In Clerk dashboard: **Users** → **Create user**
   - Email: `mongchanrattnak@gmail.com`
   - Set a password
   - Click Create

### Step 2: Set Up Database

1. **Run Migration in Supabase**
   - Go to https://supabase.com/dashboard/project/frsnagyvywoulauzvekc/sql/new
   - Copy SQL from `prisma/migrations/20250105_init/migration.sql`
   - Click **Run**

2. **Verify Tables Created**
   ```sql
   SELECT COUNT(*) FROM "Project";
   SELECT COUNT(*) FROM "Competition";
   SELECT COUNT(*) FROM "BlogPost";
   ```

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Access Admin Panel

1. Go to http://localhost:3000/admin
2. Sign in with your Clerk account
3. Start adding your content!

## 📁 File Structure

```
app/
├── admin/
│   ├── layout.tsx                    # Admin header with nav
│   ├── page.tsx                      # Dashboard with stats
│   ├── sign-in/[[...sign-in]]/      # Clerk sign-in
│   ├── unauthorized/                 # Access denied page
│   ├── projects/
│   │   ├── page.tsx                 # List all projects ✅
│   │   ├── new/page.tsx             # Create project ✅
│   │   └── [id]/page.tsx            # Edit project ✅
│   ├── achievements/
│   │   ├── page.tsx                 # List achievements ✅
│   │   ├── new/page.tsx             # TODO
│   │   └── [id]/page.tsx            # TODO
│   └── blog/
│       ├── page.tsx                  # TODO
│       ├── new/page.tsx              # TODO
│       └── [id]/page.tsx             # TODO
├── api/
│   └── admin/
│       ├── projects/
│       │   ├── route.ts             # Create project ✅
│       │   └── [id]/route.ts        # Update/Delete ✅
│       ├── achievements/             # TODO
│       └── blog/                     # TODO
components/
└── admin/
    ├── ProjectForm.tsx               # Form component ✅
    ├── DeleteButton.tsx              # Delete with confirm ✅
    ├── AchievementForm.tsx           # TODO
    └── BlogForm.tsx                  # TODO
lib/
├── auth.ts                           # Admin access control ✅
└── supabase.ts                       # Supabase client ✅
middleware.ts                         # Route protection ✅
```

## 🎯 What You Can Do Now

### ✅ Projects
- Add new projects (coding or case studies)
- Edit existing projects
- Delete projects
- Mark as featured
- Add tags, URLs, images

### ⏳ Achievements
- View list of achievements
- Can't add/edit yet (forms need to be created)

### ⏳ Blog
- Not yet implemented

## 🔧 Remaining Work

To complete the admin panel, you need to:

### 1. Finish Achievement Management
Create these files (similar to projects):
- `components/admin/AchievementForm.tsx`
- `app/admin/achievements/new/page.tsx`
- `app/admin/achievements/[id]/page.tsx`
- `app/api/admin/achievements/route.ts`
- `app/api/admin/achievements/[id]/route.ts`

### 2. Complete Blog Management
Create these files:
- `components/admin/BlogForm.tsx` (with markdown editor)
- `app/admin/blog/page.tsx`
- `app/admin/blog/new/page.tsx`
- `app/admin/blog/[id]/page.tsx`
- `app/api/admin/blog/route.ts`
- `app/api/admin/blog/[id]/route.tsx`

### 3. Add Markdown Editor for Blog
Install and configure a markdown editor:
```bash
npm install @uiw/react-md-editor
```

## 📝 Usage Examples

### Adding a Project

1. Go to `/admin/projects`
2. Click "Add Project"
3. Fill in the form:
   - Name: "My Portfolio Website"
   - Description: "Built with Next.js..."
   - Type: "Coding Project"
   - Tags: "Next.js, TypeScript, Tailwind"
   - Start Date: Select date
   - Check "Featured" if you want it on homepage
4. Click "Create Project"

### Editing Content

1. Navigate to the section (Projects/Achievements/Blog)
2. Click "Edit" on any item
3. Update the form
4. Click "Update"

### Deleting Content

1. Click "Delete" button
2. Click "Confirm" to delete (or "Cancel" to abort)

## 🔐 Security Features

1. **Clerk Authentication**: Only signed-in users can access `/admin`
2. **Email Whitelist**: Only `ADMIN_EMAIL` can perform admin actions
3. **API Protection**: All admin API routes check authorization
4. **No Public Sign-ups**: Only manually created users can sign in

## 📖 Documentation

- [CLERK_SETUP.md](./CLERK_SETUP.md) - Detailed Clerk configuration
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database setup guide
- [DATABASE_QUICKSTART.md](./DATABASE_QUICKSTART.md) - Quick database setup

## ⚠️ Important Notes

1. **First Time Setup**: You must run the database migration before using the admin panel
2. **Clerk Account**: Create your admin user in Clerk dashboard first
3. **Environment Variables**: Make sure all keys in `.env` are set correctly
4. **Development vs Production**: Use test keys for development, live keys for production

## 🐛 Troubleshooting

### Can't access admin panel
- Check if Clerk keys are set in `.env`
- Verify you created a user in Clerk dashboard
- Ensure email matches `ADMIN_EMAIL`

### Database errors
- Run the migration SQL in Supabase
- Check DATABASE_URL is correct
- Verify Supabase project is running

### Forms not working
- Check browser console for errors
- Verify API routes are accessible
- Check Prisma client is generated

## 🚀 Next Steps

1. **Set up Clerk** following CLERK_SETUP.md
2. **Run database migration** in Supabase SQL Editor
3. **Test project management** - add/edit/delete a project
4. **Complete remaining forms** for achievements and blog (or ask for help!)
5. **Add your real content** through the admin panel

## 💡 Tips

- Use the "Featured" checkbox to control what shows on your homepage
- Tags help with filtering and organization
- Markdown content in achievements and blog posts supports formatting
- Test in development before deploying to production
- Keep your Clerk secret key safe and never commit it to Git

---

**Questions?** Review the documentation files or check the inline comments in the code!

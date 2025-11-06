# Database Quick Start Guide

## 🚀 Quick Setup (3 Steps)

### Step 1: Update Your Password

Edit `.env` and replace `[YOUR_PASSWORD]` with your actual Supabase password:

```env
DATABASE_URL="postgresql://postgres.frsnagyvywoulauzvekc:YOUR_ACTUAL_PASSWORD@aws-1-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.frsnagyvywoulauzvekc:YOUR_ACTUAL_PASSWORD@aws-1-us-west-1.pooler.supabase.com:5432/postgres"
```

**To find your password:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **Database**
4. Reset your password if needed

### Step 2: Get Your Supabase Keys

Add these to your `.env` file:

1. Go to https://supabase.com/dashboard/project/frsnagyvywoulauzvekc/settings/api
2. Copy the **Project URL** and **anon key**
3. Update `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL="https://frsnagyvywoulauzvekc.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..." # paste your anon key here
```

### Step 3: Run the Migration

Go to your Supabase SQL Editor and run this:

```sql
-- Copy the entire SQL from prisma/migrations/20250105_init/migration.sql
-- Or use the SQL provided in SUPABASE_SETUP.md
```

## ✅ Verify Setup

```bash
# Test connection
npx prisma db pull

# Generate client
npx prisma generate

# Build project
npm run build
```

## 📝 Next Steps

Once your database is set up, you can:

1. **Add real data** through Supabase Dashboard → Table Editor
2. **Replace mock data** in your components with database queries
3. **Use the admin panel** to manage content (coming soon)

## 📚 Full Documentation

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions and troubleshooting.

## 🔧 Common Issues

**"Authentication failed"**
→ Double-check your password in `.env`

**"Can't reach database"**
→ Check if your IP is allowed in Supabase settings

**"Tables already exist"**
→ Your database is already set up! ✅

# Clerk Authentication Setup Guide

This guide will help you set up Clerk authentication for the admin panel.

## Step 1: Create a Clerk Account

1. Go to https://dashboard.clerk.com/sign-up
2. Create a new account
3. Create a new application

## Step 2: Get Your API Keys

1. In your Clerk dashboard, go to **API Keys**
2. Copy your keys:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

## Step 3: Update Environment Variables

Update your `.env` file with your Clerk keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

## Step 4: Configure Clerk Settings

### Disable Public Sign-ups

Since only you should have admin access:

1. Go to **User & Authentication** → **Email, Phone, Username**
2. **Disable** "Allow sign-ups" to prevent anyone else from creating accounts

### Create Your Admin Account

1. Go to **Users** in your Clerk dashboard
2. Click **Create user**
3. Enter your email: `mongchanrattnak@gmail.com`
4. Set a strong password
5. Click **Create**

## Step 5: Test the Setup

1. Run your development server: `npm run dev`
2. Go to http://localhost:3000/admin
3. You'll be redirected to the sign-in page
4. Sign in with your admin email and password
5. You should now have access to the admin panel

## Security Configuration

The admin panel is protected at multiple levels:

### 1. Middleware Protection
All `/admin/*` routes require authentication (configured in `middleware.ts`)

### 2. Email-based Access Control
Only the email specified in `ADMIN_EMAIL` environment variable can access admin features (configured in `lib/auth.ts`)

### 3. API Route Protection
All admin API routes check for authentication and authorization

## What Happens When Someone Unauthorized Tries to Access?

1. **Not signed in**: Redirected to `/admin/sign-in`
2. **Signed in but wrong email**: Redirected to `/admin/unauthorized`
3. **Signed in with correct email**: Full admin access granted

## Additional Security Tips

1. **Use a strong password** for your admin account
2. **Enable 2FA** in Clerk settings (highly recommended)
3. **Use environment-specific keys** (test keys for development, live keys for production)
4. **Never commit** your `.env` file to version control

## Troubleshooting

### "Clerk publishable key not found"
- Make sure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in `.env`
- Restart your development server after updating `.env`

### "Unauthorized" even with correct email
- Verify `ADMIN_EMAIL` in `.env` matches your Clerk account email exactly
- Check for typos or extra spaces

### Can't sign in
- Verify your Clerk keys are correct
- Check if you've disabled sign-ups in Clerk dashboard
- Make sure you've created a user in Clerk dashboard

## Production Deployment

Before deploying to production:

1. Generate new **live** API keys in Clerk dashboard
2. Update environment variables in your hosting platform (Vercel, etc.)
3. Set `ADMIN_EMAIL` to your production admin email
4. Enable 2FA on your Clerk account
5. Test the authentication flow in production

## Support

- Clerk Documentation: https://clerk.com/docs
- Clerk Discord: https://clerk.com/discord

# Webhook Setup Guide

This guide explains how to set up Supabase webhooks to automatically revalidate your Vercel deployment when database content changes.

## Step 1: Generate a Revalidation Token

Generate a secure random token for webhook authentication:

```bash
# On macOS/Linux
openssl rand -base64 32

# Or use an online generator
# https://generate-random.org/api-token-generator
```

## Step 2: Add Environment Variable to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `REVALIDATION_TOKEN`
   - **Value**: (paste the token you generated)
   - **Environment**: Production, Preview, and Development
5. Click **Save**
6. **Redeploy** your site for the environment variable to take effect

## Step 3: Add to Local .env File

Add the same token to your local `.env` file:

```env
REVALIDATION_TOKEN="your-secure-random-token-here"
```

## Step 4: Configure Supabase Webhooks

For each table that should trigger revalidation, create a webhook:

### 4.1: Go to Supabase Dashboard

1. Open your Supabase project: https://supabase.com/dashboard
2. Navigate to **Database** → **Webhooks** (in the left sidebar)

### 4.2: Create Webhooks for Each Table

Create a webhook for each of these tables:
- `Project`
- `Achievement`
- `BlogPost`
- `Tag`
- `ProjectTag`
- `AchievementTag`
- `BlogPostTag`

**For each table, use these settings:**

**Name**: `Revalidate [TableName]` (e.g., "Revalidate Project")

**Table**: Select the table (e.g., `Project`)

**Events**: Check all that apply:
- ✅ Insert
- ✅ Update
- ✅ Delete

**Type**: `HTTP Request`

**Method**: `POST`

**URL**: `https://your-domain.vercel.app/api/revalidate`
- Replace `your-domain.vercel.app` with your actual Vercel domain

**HTTP Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer your-revalidation-token-here"
}
```
- Replace `your-revalidation-token-here` with your actual token

**HTTP Params** (Body):
```json
{
  "table": "[TableName]",
  "record": "[RECORD]"
}
```
- Replace `[TableName]` with the actual table name (e.g., `Project`, `Achievement`, `BlogPost`)
- Keep `[RECORD]` as is - Supabase will replace it with the actual record data

**Example for Project table:**
```json
{
  "table": "Project",
  "record": "[RECORD]"
}
```

**Confirm**: Leave unchecked (we don't need confirmation)

Click **Create webhook**

### 4.3: Repeat for All Tables

Repeat step 4.2 for all seven tables listed above.

## Step 5: Test the Setup

### Test via Supabase

1. Go to your Supabase dashboard
2. Edit any record in one of the tables (e.g., update a project name)
3. Go to **Database** → **Webhooks**
4. Click on the webhook you created
5. Check the **Recent deliveries** section
6. You should see a successful delivery (green checkmark) with status `200`

### Test Manually

You can also test the webhook endpoint directly:

```bash
curl -X POST https://your-domain.vercel.app/api/revalidate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-revalidation-token-here" \
  -d '{"table": "Project", "record": {"id": 1}}'
```

You should get a response like:
```json
{
  "revalidated": true,
  "table": "Project",
  "message": "Successfully revalidated pages for Project",
  "timestamp": "2025-01-12T10:30:00.000Z"
}
```

## How It Works

1. When you update data in Supabase (insert, update, or delete)
2. Supabase triggers the webhook
3. The webhook calls your `/api/revalidate` endpoint
4. Next.js revalidates the relevant pages
5. The next visitor sees the updated content

## Troubleshooting

### Webhook shows failed delivery

- Check that your `REVALIDATION_TOKEN` in Vercel matches the token in the webhook
- Verify your Vercel domain is correct
- Check Vercel Function Logs for error details

### Changes still not appearing

- Check the webhook delivery logs in Supabase
- Verify the revalidation endpoint is working: `https://your-domain.vercel.app/api/revalidate` (should return a JSON message)
- Check Vercel Function Logs for any errors
- Make sure you redeployed after adding the environment variable

### Testing locally

To test webhooks locally, you'll need to:
1. Use a tool like [ngrok](https://ngrok.com/) to expose your local server
2. Update the webhook URL to your ngrok URL
3. Make sure your local `.env` has the `REVALIDATION_TOKEN`

## Additional Notes

- The revalidation happens **on-demand** - no scheduled rebuilds needed
- Only affected pages are revalidated (e.g., updating a project only revalidates project pages)
- Changes appear within seconds of updating data in Supabase
- This approach is more efficient than full rebuilds or time-based revalidation

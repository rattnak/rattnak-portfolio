// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Secret token to authenticate webhook requests
const REVALIDATION_TOKEN = process.env.REVALIDATION_TOKEN;

export async function POST(request: NextRequest) {
  try {
    // Verify the secret token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!REVALIDATION_TOKEN || token !== REVALIDATION_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const body = await request.json();
    const { table, record } = body;

    console.log('Revalidation triggered for table:', table);

    // Revalidate based on which table was updated
    switch (table) {
      case 'Project':
        // Revalidate all project-related pages
        revalidatePath('/projects');
        revalidatePath('/'); // Home page if it shows projects

        // If a specific project was updated, revalidate its detail page
        if (record?.id) {
          revalidatePath(`/projects/${record.id}`);
        }
        break;

      case 'Achievement':
        // Revalidate all achievement-related pages
        revalidatePath('/achievements');
        revalidatePath('/'); // Home page if it shows achievements

        if (record?.id) {
          revalidatePath(`/achievements/${record.id}`);
        }
        break;

      case 'BlogPost':
        // Revalidate all blog-related pages
        revalidatePath('/blog');
        revalidatePath('/'); // Home page if it shows blog posts

        // If a specific blog post was updated, revalidate its detail page
        if (record?.slug) {
          revalidatePath(`/blog/${record.slug}`);
        }
        break;

      case 'Tag':
      case 'ProjectTag':
      case 'AchievementTag':
      case 'BlogPostTag':
        // Tag changes affect multiple pages, revalidate all main pages
        revalidatePath('/projects');
        revalidatePath('/achievements');
        revalidatePath('/blog');
        revalidatePath('/');
        break;

      default:
        // If table is unknown, revalidate all main pages as a fallback
        revalidatePath('/projects');
        revalidatePath('/achievements');
        revalidatePath('/blog');
        revalidatePath('/');
    }

    return NextResponse.json({
      revalidated: true,
      table,
      message: `Successfully revalidated pages for ${table}`,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Error revalidating', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Optional: Add GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'Revalidation webhook endpoint is active',
    usage: 'Send POST request with Authorization header',
  });
}

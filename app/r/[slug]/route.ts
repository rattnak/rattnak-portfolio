// app/r/[slug]/route.ts
// Short per-application resume links: /r/stripe-2026 logs the access
// against that ResumeLink slug and serves the PDF inline.
import { NextRequest } from "next/server";
import { serveResume } from "@/lib/resume-tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return serveResume(request, slug);
}

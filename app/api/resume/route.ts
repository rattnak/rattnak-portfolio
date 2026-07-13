// app/api/resume/route.ts
import { NextRequest } from "next/server";
import { serveResume } from "@/lib/resume-tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src");
  return serveResume(request, src);
}

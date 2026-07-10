// lib/resume-tracking.ts
// Shared handler for /api/resume and /r/[slug]: logs the access (when
// the service-role key is configured), notifies a webhook, and streams
// the resume PDF. Every step besides serving the PDF fails silently so
// tracking problems can never block a recruiter from the resume.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { readFile } from "fs/promises";
import path from "path";

const RESUME_PATH = path.join(process.cwd(), "public", "resume", "chanrattnak-mong-resume.pdf");

// Common crawler signatures: skip logging entirely for these.
const BOT_PATTERN = /bot|crawler|spider|slurp|facebookexternalhit|whatsapp|preview|curl.*google/i;

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function logAccess(request: NextRequest, src: string | null) {
  const userAgent = request.headers.get("user-agent") || "";
  if (BOT_PATTERN.test(userAgent)) return;

  const supabase = serviceClient();
  if (!supabase) return;

  try {
    let linkId: number | null = null;
    if (src) {
      const { data } = await supabase
        .from("ResumeLink")
        .select("id, active")
        .eq("slug", src)
        .maybeSingle();
      if (data?.active) linkId = data.id;
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "";
    const salt = process.env.RESUME_SALT || "";
    const ipHash = ip && salt ? createHash("sha256").update(ip + salt).digest("hex") : null;

    const country = request.headers.get("x-vercel-ip-country");
    const city = request.headers.get("x-vercel-ip-city");

    const { error } = await supabase.from("ResumeAccess").insert({
      linkId,
      src: linkId ? null : src,
      referrer: request.headers.get("referer"),
      country,
      city,
      userAgent: userAgent.slice(0, 500),
      ipHash,
    });
    if (error) console.error("ResumeAccess insert failed:", error.message);

    // Optional webhook ping (Telegram bot URL or any endpoint).
    const webhook = process.env.NOTIFY_WEBHOOK_URL;
    if (webhook) {
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: src, country, city }),
      }).catch(() => {});
    }
  } catch (err) {
    console.error("Resume access logging failed:", err);
  }
}

export async function serveResume(request: NextRequest, src: string | null): Promise<NextResponse> {
  // Log without blocking the response longer than necessary.
  await logAccess(request, src);

  try {
    const pdf = await readFile(RESUME_PATH);
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="chanrattnak-mong-resume.pdf"',
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: "The resume PDF is not available right now.",
        contact: "Please reach out via the contact form at /contact instead.",
      },
      { status: 503 }
    );
  }
}

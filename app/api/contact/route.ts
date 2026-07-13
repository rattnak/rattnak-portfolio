// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// In-memory rate limit: 5 submissions per hour per hashed IP. Resets on
// deploy/cold start, which is acceptable for a personal-site contact form.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const submissions = new Map<string, number[]>();

function ipHash(request: NextRequest): string {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const salt = process.env.RESUME_SALT || "contact-form";
  return createHash("sha256").update(ip + salt).digest("hex");
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(key) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    submissions.set(key, recent);
    return true;
  }
  recent.push(now);
  submissions.set(key, recent);
  // Opportunistic cleanup so the map doesn't grow unbounded.
  if (submissions.size > 1000) {
    for (const [k, times] of submissions) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) submissions.delete(k);
    }
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, website } = await request.json();

    // Honeypot: "website" is a visually hidden field real users never
    // fill. Bots that complete every input reveal themselves here.
    // Return 200 so the bot believes it succeeded.
    if (website) {
      return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
    }

    if (isRateLimited(ipHash(request))) {
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 }
      );
    }

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Email service integration point (Resend/SES/etc.); logged until
    // one is wired up.
    console.log("Contact form submission:", {
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

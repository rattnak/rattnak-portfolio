import { NextResponse } from "next/server";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "mongchanrattnak@gmail.com";

// Click-to-reveal endpoint: the address is never rendered in server HTML,
// so it cannot be harvested by scrapers parsing the page source.
export async function POST() {
  return NextResponse.json({ email: CONTACT_EMAIL });
}

// Length only, so the masked dots can match the real address width and
// the row does not resize when it is revealed. A character count is not
// an address: it gives a scraper nothing it can contact or verify, and
// it is already inferable from the revealed value anyone can request.
export async function GET() {
  return NextResponse.json({ length: CONTACT_EMAIL.length });
}

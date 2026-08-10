import { NextResponse } from "next/server";

// Click-to-reveal endpoint: the address is never rendered in server HTML,
// so it cannot be harvested by scrapers parsing the page source.
export async function POST() {
  const email = process.env.CONTACT_EMAIL ?? "mongchanrattnak@gmail.com";
  return NextResponse.json({ email });
}

// app/api/search-index/route.ts
// Data source for the command palette: static site pages plus every
// project, fetched lazily on first palette open rather than bundled
// into every page load. Revalidated hourly like the rest of the site.
import { NextResponse } from "next/server";
import { getAllWorkRows } from "@/lib/database";

export const revalidate = 3600;

export type SearchItem = {
  id: string;
  label: string;
  sublabel?: string;
  href: string;
  kind: "page" | "project";
};

const PAGES: SearchItem[] = [
  { id: "home", label: "Home", href: "/", kind: "page" },
  { id: "work", label: "Work", sublabel: "Projects, open source, achievements", href: "/#work", kind: "page" },
  { id: "about", label: "About", href: "/about", kind: "page" },
  { id: "contact", label: "Contact", href: "/about#contact", kind: "page" },
];

export async function GET() {
  // Every work item, not just the ones that came from Project: the design
  // case studies live only in Work and were missing from search entirely.
  const rows = await getAllWorkRows();
  const projectItems: SearchItem[] = rows.map((w) => ({
    id: `work-${w.slug}`,
    label: w.name,
    sublabel: w.legacy_project_id !== null ? "Project" : "Achievement",
    href: w.legacy_project_id !== null ? `/projects/${w.slug}` : `/achievements/${w.slug}`,
    kind: "project",
  }));

  return NextResponse.json({ items: [...PAGES, ...projectItems] });
}

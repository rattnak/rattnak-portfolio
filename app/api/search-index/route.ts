// app/api/search-index/route.ts
// Data source for the command palette: static site pages plus every
// project, fetched lazily on first palette open rather than bundled
// into every page load. Revalidated hourly like the rest of the site.
import { NextResponse } from "next/server";
import { getAllProjects } from "@/lib/database";

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
  const projects = await getAllProjects();
  const projectItems: SearchItem[] = projects.map((p) => ({
    id: `project-${p.id}`,
    label: p.name,
    sublabel: "Project",
    href: `/projects/${p.slug}`,
    kind: "project",
  }));

  return NextResponse.json({ items: [...PAGES, ...projectItems] });
}

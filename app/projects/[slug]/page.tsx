// app/projects/[slug]/page.tsx
// Slug-addressed detail route. Legacy numeric ids (/projects/5) are
// caught by this same route and 301'd to the canonical slug URL; see
// slugForLegacyId below.
import { getWorkProjectBySlug, getWorkSlugs, slugForLegacyProjectId } from "@/lib/database";
import { notFound, permanentRedirect } from "next/navigation";
import ProjectDetailClient from "@/components/ProjectDetailClient";

// Force revalidation every 60 seconds to ensure fresh data from Supabase
export const revalidate = 60;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getWorkSlugs('project');
  return slugs.map((slug) => ({ slug }));
}

// A bare number in the slug position is a legacy /projects/<id> link
// (shared or indexed before the move to slugs). Resolve it and send a
// 301 to the canonical slug URL rather than 404ing or serving the page
// at two addresses. Real slugs always contain a letter, so a
// digits-only segment is unambiguous.
async function slugForLegacyId(slug: string): Promise<string | null> {
  if (!/^\d+$/.test(slug)) return null;
  return slugForLegacyProjectId(parseInt(slug, 10));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await getWorkProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} - Chanrattnak Mong`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getWorkProjectBySlug(slug);

  if (!project) {
    const canonical = await slugForLegacyId(slug);
    // permanentRedirect throws to interrupt rendering, so it must sit
    // outside the try/catch-free path above and before notFound().
    if (canonical) permanentRedirect(`/projects/${canonical}`);
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}

// app/page.tsx
import Hero from "@/components/Hero";
import WorkGrid from "@/components/WorkGrid";
import BlogSection from "@/components/BlogSection";

// 60s, matching /projects/[slug]. The homepage is the work grid, so it is
// the page most affected by a content edit; an hour of staleness was long
// enough that a bad render outlived most visits. The Supabase webhook to
// /api/revalidate makes edits appear sooner than this; this is the floor.
export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Hero />
      <WorkGrid />
      <BlogSection />
    </>
  );
}

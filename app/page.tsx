// app/page.tsx
import Hero from "@/components/Hero";
import WorkGrid from "@/components/WorkGrid";
import BlogSection from "@/components/BlogSection";

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />
      <WorkGrid />
      <BlogSection />
    </>
  );
}

// app/page.tsx
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ProjectsSection from "@/components/Projects";
import CompetitionsSection from "@/components/Competitions";
import BlogSection from "@/components/BlogSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <ProjectsSection />
      <CompetitionsSection />
      <BlogSection />
    </>
  );
}
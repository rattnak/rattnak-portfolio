// app/page.tsx
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ProjectsSection from "@/components/Projects";
import AchievementsSection from "@/components/Achievements";
import BlogSection from "@/components/BlogSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <ProjectsSection />
      <AchievementsSection />
      <BlogSection />
    </>
  );
}
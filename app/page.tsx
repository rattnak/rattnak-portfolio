// app/page.tsx
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ProjectsSection from "@/components/Projects";
import AchievementsSection from "@/components/Achievements";
import OpenSourceSection from "@/components/OpenSourceSection";
import BlogSection from "@/components/BlogSection";

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <ProjectsSection />
      <OpenSourceSection />
      <AchievementsSection />
      <BlogSection />
    </>
  );
}
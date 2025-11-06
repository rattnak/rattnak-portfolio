// components/Projects.tsx
import { getFeaturedProjects } from "@/lib/database";
import ProjectsClient from "./ProjectsClient";

export default async function ProjectsSection() {
  const projects = await getFeaturedProjects();

  return (
    <section id="projects" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <h2 className="text-xs tracking-widest uppercase mb-12" style={{ color: 'var(--text-muted)' }}>
          Selected Work
        </h2>
        <ProjectsClient projects={projects} />
      </div>
    </section>
  );
}

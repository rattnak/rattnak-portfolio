// components/Projects.tsx
import { getFeaturedProjects } from "@/lib/database";
import ProjectsClient from "./ProjectsClient";

export default async function ProjectsSection() {
  const projects = await getFeaturedProjects();

  return (
    <section id="projects" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <h2 style={{
          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 500
        }}>
          Selected Work
        </h2>
        <ProjectsClient projects={projects} />
      </div>
    </section>
  );
}

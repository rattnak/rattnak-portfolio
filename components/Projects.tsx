// components/Projects.tsx
import { mockProjects } from "@/lib/mockData";
import ProjectsClient from "./ProjectsClient";

export default async function ProjectsSection() {
  // TODO: Switch back to getProjects() after database is synced
  // const projects = await getProjects();
  const projects = mockProjects;

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

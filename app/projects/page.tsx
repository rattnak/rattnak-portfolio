// app/projects/page.tsx
import { getAllProjects } from "@/lib/database";
import ProjectsClient from "@/components/ProjectsClient";

export const metadata = {
  title: "Projects – Chanrattnak Mong",
  description: "Explore my development and design projects",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="min-h-screen">
      <div className="container" style={{ paddingTop: '4.5rem', paddingBottom: '4rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1rem' }}>
          <h1 className="text-4xl md:text-5xl font-bold" style={{
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            Projects
          </h1>
          <p className="text-lg" style={{
            color: 'var(--text-secondary)',
            lineHeight: '1.5'
          }}>
            A collection of my development and design work.
          </p>
        </div>

        {/* Projects Grid */}
        <ProjectsClient projects={projects} />
      </div>
    </div>
  );
}
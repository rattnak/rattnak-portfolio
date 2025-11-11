// app/projects/page.tsx
import { getAllProjectsWithTags } from "@/lib/database";
import ProjectsClient from "@/components/ProjectsClient";

export const metadata = {
  title: "Projects - Chanrattnak Mong",
  description: "Explore my development and design projects",
};

export default async function ProjectsPage() {
  const projects = await getAllProjectsWithTags();

  return (
    <div style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <div className="container" style={{ paddingTop: '4.5rem', paddingBottom: '4rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em'
          }}>
            Projects
          </h1>
          <p style={{
            fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
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
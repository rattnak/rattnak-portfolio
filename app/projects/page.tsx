// app/projects/page.tsx
import { mockProjects } from "@/lib/mockData";
import ProjectsClient from "@/components/ProjectsClient";

export const metadata = {
  title: "Projects – Chanrattnak Mong",
  description: "Explore my development and design projects",
};

export default function ProjectsPage() {
  const projects = mockProjects;

  return (
    <div className="min-h-screen" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Projects
          </h1>
          <p className="text-lg max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
            A collection of my development and design work, ranging from full-stack applications to UI/UX case studies.
          </p>
        </div>

        {/* Projects Grid */}
        <ProjectsClient projects={projects} />
      </div>
    </div>
  );
}
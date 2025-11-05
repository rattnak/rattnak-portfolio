// components/ProjectsClient.tsx
"use client";
import { useState } from "react";
import ProjectCard from "./ProjectCard";

type ProjectType = "CODING" | "CASE_STUDY";

type Project = {
  id: number;
  name: string;
  description: string;
  url: string;
  type: ProjectType;
  tags: string[];
  imageUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
};

type Props = {
  projects: Project[];
};

export default function ProjectsClient({ projects }: Props) {
  const [filter, setFilter] = useState<"ALL" | ProjectType>("ALL");

  const filteredProjects =
    filter === "ALL"
      ? projects
      : projects.filter((p) => p.type === filter);

  return (
    <>
      <div className="flex gap-6 mb-12" style={{ borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={() => setFilter("ALL")}
          className="text-sm pb-3 transition-all relative group"
          style={{
            color: filter === "ALL" ? 'var(--text-primary)' : 'var(--text-secondary)'
          }}
          onMouseEnter={(e) => {
            if (filter !== "ALL") {
              e.currentTarget.style.color = 'var(--text-primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (filter !== "ALL") {
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
        >
          All
          {filter === "ALL" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--accent-primary)' }} />
          )}
        </button>
        <button
          onClick={() => setFilter("CODING")}
          className="text-sm pb-3 transition-all relative group"
          style={{
            color: filter === "CODING" ? 'var(--text-primary)' : 'var(--text-secondary)'
          }}
          onMouseEnter={(e) => {
            if (filter !== "CODING") {
              e.currentTarget.style.color = 'var(--text-primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (filter !== "CODING") {
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
        >
          Development
          {filter === "CODING" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--accent-primary)' }} />
          )}
        </button>
        <button
          onClick={() => setFilter("CASE_STUDY")}
          className="text-sm pb-3 transition-all relative group"
          style={{
            color: filter === "CASE_STUDY" ? 'var(--text-primary)' : 'var(--text-secondary)'
          }}
          onMouseEnter={(e) => {
            if (filter !== "CASE_STUDY") {
              e.currentTarget.style.color = 'var(--text-primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (filter !== "CASE_STUDY") {
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
        >
          Design
          {filter === "CASE_STUDY" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--accent-primary)' }} />
          )}
        </button>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
          <p>No projects found in this category.</p>
        </div>
      ) : (
        <div className="grid-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      )}
    </>
  );
}

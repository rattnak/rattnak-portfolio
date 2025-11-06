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
      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        marginBottom: '1rem',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '0'
      }}>
        <button
          onClick={() => setFilter("ALL")}
          className="transition-all relative"
          style={{
            color: filter === "ALL" ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: '0.9375rem',
            fontWeight: 500,
            paddingBottom: '0.75rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
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
          All Projects
          {filter === "ALL" && (
            <div className="absolute bottom-0 left-0 right-0" style={{
              height: '2px',
              backgroundColor: 'var(--accent-primary)'
            }} />
          )}
        </button>
        <button
          onClick={() => setFilter("CODING")}
          className="transition-all relative"
          style={{
            color: filter === "CODING" ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: '0.9375rem',
            fontWeight: 500,
            paddingBottom: '0.75rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
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
            <div className="absolute bottom-0 left-0 right-0" style={{
              height: '2px',
              backgroundColor: 'var(--accent-primary)'
            }} />
          )}
        </button>
        <button
          onClick={() => setFilter("CASE_STUDY")}
          className="transition-all relative"
          style={{
            color: filter === "CASE_STUDY" ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: '0.9375rem',
            fontWeight: 500,
            paddingBottom: '0.75rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
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
            <div className="absolute bottom-0 left-0 right-0" style={{
              height: '2px',
              backgroundColor: 'var(--accent-primary)'
            }} />
          )}
        </button>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center" style={{
          padding: '6rem 0',
          color: 'var(--text-muted)'
        }}>
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

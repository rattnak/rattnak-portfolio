// components/ProjectsClient.tsx
"use client";
import { useState } from "react";
import ProjectCard from "./ProjectCard";

type ProjectType = "CODING" | "CASE_STUDY";

type Tag = {
  id: number;
  name: string;
  slug: string;
  type: 'TECHNICAL' | 'NON_TECHNICAL';
  color: string | null;
};

type Project = {
  id: number;
  name: string;
  excerpt: string | null;
  description: string;
  url: string | null;
  type: ProjectType;
  tags: string[]; // Legacy
  tagList: Tag[]; // New: resolved tags from junction table
  imageUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  startDate: Date | string;
  endDate: Date | string | null;
  createdAt: Date | string;
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
      <div className="filter-tabs-container">
        <button
          onClick={() => setFilter("ALL")}
          className={`filter-tab ${filter === "ALL" ? "active" : ""}`}
        >
          All Projects
          {filter === "ALL" && <div className="filter-tab-indicator" />}
        </button>
        <button
          onClick={() => setFilter("CODING")}
          className={`filter-tab ${filter === "CODING" ? "active" : ""}`}
        >
          Development
          {filter === "CODING" && <div className="filter-tab-indicator" />}
        </button>
        <button
          onClick={() => setFilter("CASE_STUDY")}
          className={`filter-tab ${filter === "CASE_STUDY" ? "active" : ""}`}
        >
          Design
          {filter === "CASE_STUDY" && <div className="filter-tab-indicator" />}
        </button>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <p>No projects found in this category.</p>
        </div>
      ) : (
        <div className="grid-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              tags={project.tagList ? project.tagList.map(tag => tag.name) : []}
              tagList={project.tagList}
            />
          ))}
        </div>
      )}
    </>
  );
}

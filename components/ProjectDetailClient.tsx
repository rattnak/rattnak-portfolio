// components/ProjectDetailClient.tsx
"use client";
import Link from "next/link";
import Tag from "./Tag";

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
  overview?: string;
  features?: string[];
  technologies?: string[];
  challenges?: string;
  outcomes?: string;
};

type Props = {
  project: Project;
};

export default function ProjectDetailClient({ project }: Props) {
  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <div className="container max-w-4xl">
        {/* Back button */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm link-text mb-8 group"
        >
          <svg 
            className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>

        {/* Project header */}
        <div className="space-y-6 mb-12">
          {/* Badges */}
          <div className="flex items-center gap-2">
            <Tag variant="primary" size="md">
              {project.type === "CODING" ? "DEVELOPMENT" : "DESIGN"}
            </Tag>
            {project.featured && (
              <Tag variant="warning" size="md">
                Featured
              </Tag>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {project.name}
          </h1>

          {/* Description */}
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {project.description}
          </p>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <Tag key={idx} size="md">
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary group inline-flex"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                View on GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary group inline-flex"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Project image */}
        {project.imageUrl && (
          <div className="mb-12 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <img
              src={project.imageUrl}
              alt={project.name}
              className="w-full object-cover aspect-video"
            />
          </div>
        )}

        {/* Overview section */}
        <div 
          className="rounded-xl p-8 mb-8 space-y-4" 
          style={{
            backgroundColor: 'var(--background-secondary)',
            border: '1px solid var(--border)'
          }}
        >
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Overview
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {project.overview || project.description}
          </p>

          {project.technologies && project.technologies.length > 0 && (
            <div className="pt-4">
              <h3 className="text-sm font-medium uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <Tag key={idx} size="sm">
                    {tech}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Features section */}
        {project.features && project.features.length > 0 && (
          <div 
            className="rounded-xl p-8 mb-8 space-y-4" 
            style={{
              backgroundColor: 'var(--background-secondary)',
              border: '1px solid var(--border)'
            }}
          >
            <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Key Features
            </h2>
            <ul className="space-y-3">
              {project.features.map((feature, idx) => (
                <li key={idx} className="flex gap-3">
                  <svg 
                    className="w-5 h-5 flex-shrink-0 mt-0.5" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Challenges & Outcomes */}
        {(project.challenges || project.outcomes) && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {project.challenges && (
              <div 
                className="rounded-xl p-8 space-y-3" 
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  border: '1px solid var(--border)'
                }}
              >
                <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Challenges
                </h3>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {project.challenges}
                </p>
              </div>
            )}
            {project.outcomes && (
              <div 
                className="rounded-xl p-8 space-y-3" 
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  border: '1px solid var(--border)'
                }}
              >
                <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Outcomes
                </h3>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {project.outcomes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Back button at bottom */}
        <div className="mt-16 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm link-text group"
          >
            <svg 
              className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
          </div>
      </div>
    </div>
  );
}
// components/ProjectDetailClient.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import Tag from "./Tag";

type ProjectType = "CODING" | "CASE_STUDY";

type TagType = {
  id: number;
  name: string;
  slug: string;
  type: 'TECHNICAL' | 'NON_TECHNICAL';
  color: string | null;
};

type Project = {
  id: number;
  name: string;
  excerpt?: string | null;
  description: string;
  overview?: string | null;
  url: string | null;
  type: ProjectType;
  tags?: string[]; 
  tagList?: TagType[]; 
  imageUrl?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  startDate: Date | string;
  endDate?: Date | string | null;
};

type Props = {
  project: Project;
};

export default function ProjectDetailClient({ project }: Props) {
  const tagsWithColors = project.tagList || [];

  // Debug: Log overview content (only in development)
  if (process.env.NODE_ENV === 'development' && project.overview) {
    console.log('Project overview:', project.overview.substring(0, 100));
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 4rem)' }}>
      {/* Sticky Back button */}
      <div
        style={{
          position: 'sticky',
          top: '4rem',
          backgroundColor: 'var(--background)',
          zIndex: 10,
          width: '100%',
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: '80rem',
            paddingTop: 'clamp(0.75rem, 2vw, 1rem)',
            paddingBottom: 'clamp(0.75rem, 2vw, 1rem)',
          }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center group"
            style={{
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              transition: 'color 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = 'var(--accent-primary)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = 'var(--text-secondary)')
            }
          >
            <svg
              className="transition-transform group-hover:-translate-x-1"
              style={{ width: '0.875rem', height: '0.875rem' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Projects
          </Link>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '0', paddingBottom: '4rem', maxWidth: '80rem' }}>
        {/* Project header */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="flex items-center" style={{ gap: '0.75rem', marginBottom: '1rem' }}>
            <span className="project-detail-meta-label">
              {project.type === "CODING" ? "Development" : "Design Case Study"}
            </span>
            {project.featured && (
              <>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span className="project-detail-meta-label" style={{ color: 'var(--accent-primary)' }}>
                  Featured
                </span>
              </>
            )}
          </div>

          <div className="flex items-start justify-between" style={{ gap: '1rem', marginBottom: '1rem' }}>
            <h1 className="project-detail-title" style={{ flex: 1 }}>
              {project.name}
            </h1>
            {project.type === "CODING" && project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary group"
                style={{ flexShrink: 0 }}
              >
                <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary group">
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Relevant Link
              </a>
            )}
          </div>

          <p className="project-detail-description" style={{ marginBottom: '1.5rem' }}>
            {project.description}
          </p>

          {/* Links */}
          <div className="flex flex-wrap" style={{ gap: '1rem' }}>
            {project.type === "CASE_STUDY" && project.url && (
              <a href={project.url} target="_blank" rel="noreferrer" className="btn btn-primary group">
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Case Study
              </a>
            )}
          </div>
        </div>

        {/* Project image */}
        {project.imageUrl && (
          <div style={{ marginBottom: '3rem', borderRadius: '0.75rem', overflow: 'hidden', backgroundColor: 'var(--background-secondary)' }}>
            <div className="w-full aspect-[16/9] relative">
              <Image src={project.imageUrl} alt={project.name} fill className="object-cover" priority />
            </div>
          </div>
        )}

        {/* Project details */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr]" style={{ gap: '3rem' }}>
          {/* Left Column - Metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Timeline */}
            <section>
              <h2 className="project-detail-section-title">Timeline</h2>
              <div className="flex items-center" style={{ gap: '1rem' }}>
                <div>
                  <p className="project-detail-timeline-label">Start</p>
                  <p className="project-detail-timeline-value">
                    {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <svg style={{ width: '1.65rem', height: '1.75rem', color: 'var(--text-muted)', paddingTop: '0.875rem', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <div>
                  <p className="project-detail-timeline-label">End</p>
                  <p className="project-detail-timeline-value">
                    {project.endDate ? new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Ongoing"}
                  </p>
                </div>
              </div>
            </section>

            {/* Technologies */}
            <section>
              <h2 className="project-detail-section-title">Technologies</h2>
              <div className="flex flex-wrap" style={{ gap: '0.5rem' }}>
                {tagsWithColors?.map((tag) => (
                  <Tag key={tag.id} size="sm" color={tag.color}>{tag.name}</Tag>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Overview */}
          <div>
            {project.overview && (
              <section>
                <h2 className="project-detail-section-title">Overview</h2>
                <div
                  className="project-overview-content"
                  style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}
                  dangerouslySetInnerHTML={{ __html: project.overview }}
                />
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

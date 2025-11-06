// components/ProjectDetailClient.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import Tag from "./Tag";

type ProjectType = "CODING" | "CASE_STUDY";

type Project = {
  id: number;
  name: string;
  description: string;
  url: string;
  type: ProjectType;
  tags?: string[];
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
  return (
    <div className="min-h-screen">
      <div className="container" style={{
        paddingTop: '4.5rem',
        paddingBottom: '4rem',
        maxWidth: '56rem'
      }}>
        {/* Back button */}
        <Link
          href="/projects"
          className="inline-flex items-center group"
          style={{
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <svg className="transition-transform group-hover:-translate-x-1" style={{ width: '0.875rem', height: '0.875rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>

        {/* Project header */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="flex items-center" style={{ gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              fontWeight: 500
            }}>
              {project.type === "CODING" ? "Development" : "Design Case Study"}
            </span>
            {project.featured && (
              <>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--accent-primary)'
                }}>
                  Featured
                </span>
              </>
            )}
          </div>

          <h1 style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '1rem',
            lineHeight: 1.2,
            letterSpacing: '-0.02em'
          }}>
            {project.name}
          </h1>

          <p style={{
            fontSize: '1.0625rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            marginBottom: '1.5rem'
          }}>
            {project.description}
          </p>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap" style={{ gap: '0.5rem', marginBottom: '1.5rem', opacity: 0.7 }}>
              {project.tags.map((tag, idx) => (
                <Tag key={idx} size="sm">
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap" style={{ gap: '1rem' }}>
            {project.type === "CODING" && project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Live Demo
              </a>
            )}
            {project.type === "CASE_STUDY" && project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary group"
              >
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
          <div style={{
            marginBottom: '3rem',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            backgroundColor: 'var(--background-secondary)',
            border: '1px solid var(--border)'
          }}>
            <div className="w-full aspect-[16/9] relative">
              <Image
                src={project.imageUrl}
                alt={project.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Project details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <section>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '1rem'
            }}>
              Overview
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{
                fontSize: '1.0625rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary)'
              }}>
                {project.description}
              </p>
              <p style={{
                fontSize: '1.0625rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary)'
              }}>
                This project showcases my skills in {project.tags?.join(", ")}.
                {project.type === "CODING"
                  ? " The application was built with modern web technologies and follows best practices for performance, accessibility, and user experience."
                  : " The design process included extensive user research, wireframing, prototyping, and usability testing to ensure the final product meets user needs."
                }
              </p>
            </div>
          </section>

          <section>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '1rem'
            }}>
              Technologies & Skills
            </h2>
            <div className="flex flex-wrap" style={{ gap: '0.5rem', opacity: 0.7 }}>
              {project.tags?.map((tag, idx) => (
                <Tag key={idx} size="sm">
                  {tag}
                </Tag>
              ))}
            </div>
          </section>

          <section>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '1rem'
            }}>
              Project Timeline
            </h2>
            <div className="flex flex-wrap items-center" style={{ gap: '2rem' }}>
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem'
                }}>
                  Start Date
                </p>
                <p style={{
                  fontSize: '1.0625rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)'
                }}>
                  {new Date(project.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '1.5rem' }}>→</span>
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem'
                }}>
                  End Date
                </p>
                <p style={{
                  fontSize: '1.0625rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)'
                }}>
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : "Ongoing"
                  }
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Back button at bottom */}
        <div style={{
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border)'
        }}>
          <Link
            href="/projects"
            className="inline-flex items-center group"
            style={{
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <svg className="transition-transform group-hover:-translate-x-1" style={{ width: '0.875rem', height: '0.875rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
        </div>
      </div>
    </div>
  );
}

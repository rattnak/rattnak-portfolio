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
    <div className="min-h-screen" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
      <div className="container max-w-4xl">
        {/* Back button */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm link-text mb-8 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>

        {/* Project header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              {project.type === "CODING" ? "Development" : "Design Case Study"}
            </span>
            {project.featured && (
              <>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span className="text-xs font-medium" style={{ color: 'var(--accent-primary)' }}>
                  Featured
                </span>
              </>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            {project.name}
          </h1>

          <p className="text-xl leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            {project.description}
          </p>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag, idx) => (
                <Tag key={idx} size="md">
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-4">
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
          <div className="mb-16 rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--background-secondary)' }}>
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
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              Overview
            </h2>
            <div className="space-y-4">
              <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                {project.description}
              </p>
              <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                This project showcases my skills in {project.tags?.join(", ")}.
                {project.type === "CODING"
                  ? " The application was built with modern web technologies and follows best practices for performance, accessibility, and user experience."
                  : " The design process included extensive user research, wireframing, prototyping, and usability testing to ensure the final product meets user needs."
                }
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              Technologies & Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.tags?.map((tag, idx) => (
                <Tag key={idx} size="lg">
                  {tag}
                </Tag>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              Project Timeline
            </h2>
            <div className="flex flex-wrap items-center gap-6" style={{ color: 'var(--text-secondary)' }}>
              <div>
                <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Start Date</p>
                <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                  {new Date(project.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>→</span>
              <div>
                <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>End Date</p>
                <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
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
        <div className="mt-16 pt-16" style={{ borderTop: '1px solid var(--border)' }}>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm link-text group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
        </div>
      </div>
    </div>
  );
}

// components/ProjectDetailClient.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Tag from "./Tag";
import Breadcrumb from "./Breadcrumb";
import { WORK_CATEGORY_META } from "@/lib/database";

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

const GithubIcon = () => (
  <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const ExternalIcon = () => (
  <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

function ProjectActions({ project, compact = false }: { project: Project; compact?: boolean }) {
  // Full-size (non-compact) buttons keep their text label in markup at
  // every width, but hide it visually below 640px (btn-icon-mobile),
  // same treatment the condensed sticky header already uses, so the
  // title and up to 2-3 buttons always fit on one line. The label text
  // itself (not aria-label) carries the accessible name in both cases,
  // since visually hiding text is not the same as removing it from the
  // accessibility tree, an aria-label here would announce twice.
  const iconOnlyClass = compact ? "" : " btn-icon-mobile";
  return (
    <div className="flex flex-wrap project-detail-actions" style={{ gap: compact ? '0.5rem' : '0.75rem' }}>
      {project.type === "CODING" && project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          className={compact ? "btn-icon" : `btn btn-secondary group${iconOnlyClass}`}
          aria-label={compact ? "View on GitHub" : undefined}
          title={compact ? "View on GitHub" : undefined}
        >
          <GithubIcon />
          {!compact && <span className="btn-icon-mobile-label">View on GitHub</span>}
        </a>
      )}
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer"
          className={compact ? "btn-icon" : `btn btn-primary group${iconOnlyClass}`}
          aria-label={compact ? "Live Website" : undefined}
          title={compact ? "Live Website" : undefined}
        >
          <ExternalIcon />
          {!compact && <span className="btn-icon-mobile-label">Live Website</span>}
        </a>
      )}
      {project.type === "CASE_STUDY" && project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className={compact ? "btn-icon" : `btn btn-primary group${iconOnlyClass}`}
          aria-label={compact ? "View Case Study" : undefined}
          title={compact ? "View Case Study" : undefined}
        >
          <ExternalIcon />
          {!compact && <span className="btn-icon-mobile-label">View Case Study</span>}
        </a>
      )}
    </div>
  );
}

export default function ProjectDetailClient({ project }: Props) {
  const tagsWithColors = project.tagList || [];
  const dateLabel = new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const endLabel = project.endDate
    ? new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : "Ongoing";
  const hasActions = (project.type === "CODING" && project.githubUrl) || project.liveUrl || (project.type === "CASE_STUDY" && project.url);

  // Condensed sticky header: a sentinel sits at the header's natural
  // position; once it scrolls past the (sticky) navbar, the header
  // switches to its compact pinned form instead of staying full-size
  // (title + links + a full skills row) for the entire read.
  const [condensed, setCondensed] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCondensed(!entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px", threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const metaLine = (
    <div className="instrument flex items-center flex-wrap" style={{ gap: '0.5rem', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
      <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {project.type === "CODING" ? "Engineering" : "Case study"}
      </span>
      <span aria-hidden="true">&middot;</span>
      <span>{dateLabel}{project.endDate || project.type === "CODING" ? <> &#8594; {endLabel}</> : null}</span>
      {project.featured && (
        <>
          <span aria-hidden="true">&middot;</span>
          <span style={{ color: 'var(--accent-primary)' }}>Featured</span>
        </>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 4rem)' }}>
      {/* Sticky header: back-link, meta, title, actions, and skills all
          pinned as one unit. Condenses to a slim bar once scrolled so it
          doesn't occupy a large share of the screen for the whole read. */}
      <div className={`project-detail-sticky ${condensed ? "project-detail-sticky-condensed" : ""}`}>
        <div className="container project-detail-sticky-inner">
          {/* Work / <category> / <title>. The middle segment matches the
              work grid's own filter word, so the trail names the same
              slice of the grid the card came from. */}
          <Breadcrumb
            condensed={condensed}
            trail={[
              { label: "Work", href: "/#work" },
              WORK_CATEGORY_META[project.type === "CODING" ? "develop" : "design"],
              { label: project.name },
            ]}
          />

          {!condensed && (
            <div style={{ marginBottom: '1rem' }}>{metaLine}</div>
          )}

          <div className="project-detail-title-row">
            <h1 className={condensed ? "project-detail-title-condensed" : "project-detail-title"}>
              {project.name}
            </h1>
            {hasActions && <ProjectActions project={project} compact={condensed} />}
          </div>

          {!condensed && tagsWithColors.length > 0 && (
            <div className="flex flex-wrap" style={{ gap: '0.5rem', marginTop: '1rem' }}>
              {tagsWithColors.map((tag) => (
                <Tag key={tag.id} size="sm" color={tag.color}>{tag.name}</Tag>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sentinel: invisible, marks the header's natural top position so
          the IntersectionObserver above knows when it has scrolled under
          the sticky navbar. */}
      <div ref={sentinelRef} style={{ height: 0 }} />

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        {/* TLDR: a distinct callout, not just the first paragraph of body copy.
            The label sits on the box's top border like a fieldset legend,
            rather than as its own line of text inside. */}
        <div className="project-detail-tldr" style={{ marginBottom: '2.5rem' }}>
          <span className="instrument-label project-detail-tldr-mark">TL;DR</span>
          <p style={{ margin: 0 }}>{project.description}</p>
        </div>

        {project.imageUrl && (
          <div style={{ marginBottom: '2.5rem', borderRadius: '0.75rem', overflow: 'hidden', backgroundColor: 'var(--background-secondary)' }}>
            <div className="w-full aspect-[16/9] relative">
              <Image src={project.imageUrl} alt={project.name} fill className="object-cover" priority />
            </div>
          </div>
        )}

        {project.overview && (
          <section>
            <h2 className="project-detail-section-title">Overview</h2>
            <div
              className="project-overview-content"
              style={{ fontSize: 'var(--text-base)', lineHeight: 1.7, color: 'var(--text-secondary)' }}
              dangerouslySetInnerHTML={{ __html: project.overview }}
            />
          </section>
        )}
      </div>
    </div>
  );
}

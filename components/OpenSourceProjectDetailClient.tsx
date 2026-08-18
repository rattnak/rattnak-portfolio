// components/OpenSourceProjectDetailClient.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import Breadcrumb from "./Breadcrumb";
import { WORK_CATEGORY_META } from "@/lib/database";

type Contribution = {
  id: number;
  description: string;
  prUrl: string | null;
  githubUrl: string | null;
  merged: boolean;
  date: Date | string;
};

type ProjectGroup = {
  projectName: string;
  organization: string | null;
  githubUrl: string | null;
  // Labeled links, absorbed from the old liveUrl column. Rendered in the
  // amber signal; the repo link above stays teal.
  links: { label: string; url: string }[] | null;
  mergedCount: number;
  totalCount: number;
  contributions: Contribution[];
};

type Props = {
  group: ProjectGroup;
  repoInfo?: { stars: string; description: string | null } | null;
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

export default function OpenSourceProjectDetailClient({ group, repoInfo }: Props) {
  const sortedContributions = [...group.contributions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Condensed sticky header, same pattern as Projects and Achievements:
  // full size at the top, condenses to a slim bar once scrolled past
  // its natural position instead of staying large for the whole read.
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

  const hasActions = group.githubUrl || (group.links?.length ?? 0) > 0;
  const actions = hasActions && (
    <div className="flex flex-wrap project-detail-actions" style={{ gap: condensed ? '0.5rem' : '0.75rem' }}>
      {group.githubUrl && (
        <a
          href={group.githubUrl}
          target="_blank"
          rel="noreferrer"
          className={condensed ? "btn-icon" : "btn btn-secondary group btn-icon-mobile"}
          aria-label={condensed ? "View on GitHub" : undefined}
          title={condensed ? "View on GitHub" : undefined}
        >
          <GithubIcon />
          {!condensed && <span className="btn-icon-mobile-label">View on GitHub</span>}
        </a>
      )}
      {(group.links ?? []).map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className={condensed ? "btn-icon" : "btn btn-primary group btn-icon-mobile"}
          aria-label={condensed ? link.label : undefined}
          title={condensed ? link.label : undefined}
        >
          <ExternalIcon />
          {!condensed && <span className="btn-icon-mobile-label">{link.label}</span>}
        </a>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 4rem)' }}>
      {/* Sticky header: back-link, meta, and title+actions row pinned as
          one unit, condensing on scroll, same pattern as Projects and
          Achievements. */}
      <div className={`project-detail-sticky ${condensed ? "project-detail-sticky-condensed" : ""}`}>
        <div className="container project-detail-sticky-inner">
          <Breadcrumb
            condensed={condensed}
            trail={[
              { label: "Work", href: "/#work" },
              WORK_CATEGORY_META.opensource,
              { label: group.projectName },
            ]}
          />

          {!condensed && (
            <div className="flex items-center flex-wrap" style={{ gap: '0.75rem', marginBottom: '1rem' }}>
              {group.organization && (
                <span style={{
                  fontSize: 'var(--text-xs)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--text-muted)',
                  fontWeight: 500
                }}>
                  {group.organization}
                </span>
              )}
              <span aria-hidden="true" style={{ color: 'var(--text-muted)' }}>&middot;</span>
              <span style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 500,
                color: 'var(--accent-primary)'
              }}>
                {group.mergedCount} of {group.totalCount} merged
              </span>
            </div>
          )}

          <div className="project-detail-title-row">
            <h1 className={condensed ? "project-detail-title-condensed" : "project-detail-title"}>
              {group.projectName}
            </h1>
            {actions}
          </div>
        </div>
      </div>

      <div ref={sentinelRef} style={{ height: 0 }} />

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        {repoInfo && (
          <p
            className="instrument"
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              marginBottom: '1rem',
            }}
          >
            &#9733; {repoInfo.stars}
            {repoInfo.description ? <> &middot; {repoInfo.description}</> : null}
          </p>
        )}

        <p style={{
          fontSize: 'var(--text-md)',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
          marginBottom: '2.5rem'
        }}>
          {group.totalCount} pull request{group.totalCount === 1 ? "" : "s"} submitted to {group.projectName}
          {group.organization ? ` (${group.organization})` : ""}, summarized below.
        </p>

        {/* PR list */}
        <div>
          <h2 className="detail-section-title">
            Pull Requests
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sortedContributions.map((c) => (
              <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="flex items-center flex-wrap" style={{ gap: '0.5rem', fontSize: 'var(--text-xs)' }}>
                  {c.merged && (
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>
                      Merged
                    </span>
                  )}
                  <span style={{ color: 'var(--text-muted)' }}>&middot;</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                    {new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <p style={{
                  fontSize: 'var(--text-ui)',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  {c.description}
                </p>

                {c.prUrl && (
                  <a
                    href={c.prUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="project-card-link"
                    style={{ fontSize: 'var(--text-sm)', alignSelf: 'flex-start' }}
                  >
                    View PR &#8594;
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

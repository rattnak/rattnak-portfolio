// components/OpenSourceProjectDetailClient.tsx
"use client";
import Link from "next/link";

type Contribution = {
  id: number;
  description: string;
  prUrl: string | null;
  repoUrl: string | null;
  merged: boolean;
  date: Date | string;
};

type ProjectGroup = {
  projectName: string;
  organization: string | null;
  repoUrl: string | null;
  liveUrl: string | null;
  mergedCount: number;
  totalCount: number;
  contributions: Contribution[];
};

type Props = {
  group: ProjectGroup;
};

export default function OpenSourceProjectDetailClient({ group }: Props) {
  const sortedContributions = [...group.contributions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <div className="container" style={{ paddingTop: '4.5rem', paddingBottom: '4rem', maxWidth: '56rem' }}>
        <Link
          href="/open-source"
          className="inline-flex items-center group"
          style={{
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem'
          }}
        >
          <svg className="transition-transform group-hover:-translate-x-1" style={{ width: '0.875rem', height: '0.875rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Open Source
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="flex items-center flex-wrap" style={{ gap: '0.75rem', marginBottom: '1rem' }}>
            {group.organization && (
              <span style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--text-muted)',
                fontWeight: 500
              }}>
                {group.organization}
              </span>
            )}
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--accent-primary)'
            }}>
              {group.mergedCount} of {group.totalCount} merged
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '1rem',
            lineHeight: 1.2,
            letterSpacing: '-0.02em'
          }}>
            {group.projectName}
          </h1>

          <p style={{
            fontSize: '1.0625rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            marginBottom: '1.5rem'
          }}>
            {group.totalCount} pull request{group.totalCount === 1 ? "" : "s"} submitted to {group.projectName}
            {group.organization ? ` (${group.organization})` : ""}, summarized below.
          </p>

          <div className="flex flex-wrap" style={{ gap: '1rem' }}>
            {group.repoUrl && (
              <a
                href={group.repoUrl}
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
            {group.liveUrl && (
              <a
                href={group.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Website
              </a>
            )}
          </div>
        </div>

        {/* PR list */}
        <div>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Pull Requests
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sortedContributions.map((c) => (
              <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="flex items-center flex-wrap" style={{ gap: '0.5rem', fontSize: '0.75rem' }}>
                  {c.merged && (
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>
                      Merged
                    </span>
                  )}
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                    {new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <p style={{
                  fontSize: '0.9375rem',
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
                    style={{ fontSize: '0.8125rem', alignSelf: 'flex-start' }}
                  >
                    View PR →
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

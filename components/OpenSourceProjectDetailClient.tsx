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

          {group.repoUrl && (
            <a
              href={group.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Repository
            </a>
          )}
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

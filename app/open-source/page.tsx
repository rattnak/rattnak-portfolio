// app/open-source/page.tsx
import { getOpenSourceContributionsGroupedByProject } from "@/lib/database";
import OpenSourceCard from "@/components/OpenSourceCard";

export const metadata = {
  title: "Open Source - Chanrattnak Mong",
  description: "Open source contributions across community-maintained projects",
};

export const revalidate = 3600;

export default async function OpenSourcePage() {
  const groups = await getOpenSourceContributionsGroupedByProject();

  return (
    <div style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <div className="container" style={{ paddingTop: '4.5rem', paddingBottom: '4rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em'
          }}>
            Open Source
          </h1>
          <p style={{
            fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            Contributions to community-maintained projects, including contributions during Google Summer of Code 2026.
          </p>
        </div>

        {groups.length === 0 ? (
          <div className="empty-state">
            <p>No open source contributions to display yet.</p>
          </div>
        ) : (
          <div className="grid-3">
            {groups.map((g) => (
              <OpenSourceCard key={g.slug} {...g} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

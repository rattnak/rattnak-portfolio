// components/OpenSourceSection.tsx
import { getOpenSourceContributionsGroupedByProject } from "@/lib/database";
import OpenSourceCard from "./OpenSourceCard";
import Link from "next/link";

export default async function OpenSourceSection() {
  const allGroups = await getOpenSourceContributionsGroupedByProject();
  const groups = allGroups.filter((g) => g.featured).slice(0, 3);

  if (groups.length === 0) return null;

  return (
    <section id="open-source" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'clamp(2rem, 4vw, 3rem)'
        }}>
          <h2 className="services-section-title" style={{ marginBottom: 0 }}>
            Open Source Contributions
          </h2>
          <Link
            href="/open-source"
            className="link-text inline-flex items-center group"
            style={{
              fontSize: 'clamp(0.8125rem, 1.5vw, 0.875rem)',
              gap: '0.25rem'
            }}
          >
            View All
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid-3">
          {groups.map((g) => (
            <OpenSourceCard key={g.slug} {...g} />
          ))}
        </div>
      </div>
    </section>
  );
}

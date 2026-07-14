// components/OpenSourceCard.tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";

type Props = {
  slug: string;
  projectName: string;
  organization?: string | null;
  mergedCount: number;
  totalCount: number;
  latestDate: Date | string;
};

export default function OpenSourceCard({
  slug,
  projectName,
  organization,
  mergedCount,
  totalCount,
  latestDate,
}: Props) {
  return (
    <Link href={`/open-source/${slug}`} className="block">
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="card cursor-pointer"
        style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%' }}
      >
        <div className="flex items-center flex-wrap" style={{ gap: '0.5rem', fontSize: '0.75rem' }}>
          {organization && (
            <span style={{
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              fontWeight: 500
            }}>
              {organization}
            </span>
          )}
          {mergedCount > 0 && (
            <>
              {organization && <span style={{ color: 'var(--text-muted)' }}>•</span>}
              <span style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>
                {mergedCount} merged
              </span>
            </>
          )}
        </div>

        <h3 className="project-card-title">
          {projectName}
        </h3>

        <p className="project-card-description">
          {totalCount} pull request{totalCount === 1 ? "" : "s"} submitted
        </p>

        <div className="flex items-center project-card-links">
          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
            {new Date(latestDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
          <span className="project-card-link">
            View PRs →
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

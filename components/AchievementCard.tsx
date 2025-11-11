// components/CompetitionCard.tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Tag from "./Tag";

type Props = {
  id: number;
  name: string;
  type: string;
  description: string;
  result: string;
  organizer?: string | null;
  imageUrl?: string | null;
  url?: string | null;
  tags?: string[];
  date: Date | string;
  featured?: boolean;
};

export default function CompetitionCard({
  id,
  name,
  type,
  description,
  result,
  organizer,
  imageUrl,
  url,
  tags,
  date,
  featured,
}: Props) {
  return (
    <Link href={`/achievements/${id}`} className="block">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="card group cursor-pointer"
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {imageUrl && (
          <div className="project-card-image achievement-card-image">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        <div className="competition-card-content">
          <div className="flex items-center flex-wrap project-card-meta">
            <span style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              fontWeight: 500
            }}>
              {type}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--accent-primary)',
              fontWeight: 500
            }}>
              {result}
            </span>
            {featured && (
              <>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{
                  color: 'var(--accent-primary)',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured
                </span>
              </>
            )}
          </div>

          <h3 className="project-card-title">
            {name}
          </h3>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap project-card-tags" style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
              {tags.slice(0, 4).map((tag, idx) => (
                <Tag key={idx} size="sm">
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          <p className="project-card-description">
            {description}
          </p>

          <div className="flex items-center project-card-links">
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
              {new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="transition-colors inline-flex items-center"
                style={{ color: 'var(--accent-primary)', fontWeight: 500, gap: '0.25rem' }}
              >
                <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                External
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

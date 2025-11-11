// components/CompetitionListItem.tsx
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

export default function CompetitionListItem({
  id,
  name,
  type,
  description,
  result,
  imageUrl,
  url,
  tags,
  date,
  featured,
}: Props) {
  return (
    <Link href={`/achievements/${id}`} className="block">
      <motion.div
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="card group cursor-pointer competition-list-item"
      >
        {imageUrl && (
          <div className="competition-list-item-image">
            <img
              src={imageUrl}
              alt={name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              className="group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        <div className="competition-list-item-content">
          <div className="flex items-center flex-wrap" style={{
            gap: '0.5rem',
            fontSize: '0.75rem'
          }}>
            <span style={{
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              fontWeight: 500
            }}>
              {type}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>
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

          <h3 style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            margin: 0
          }}>
            {name}
          </h3>

          <p style={{
            fontSize: '0.9375rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {description}
          </p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap" style={{ gap: '0.5rem' }}>
              {tags.slice(0, 4).map((tag, idx) => (
                <Tag key={idx} size="sm">
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          <div className="flex items-center" style={{
            gap: '1rem',
            fontSize: '0.875rem'
          }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
              {new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="transition-colors"
                style={{ color: 'var(--accent-primary)', fontWeight: 500 }}
              >
                View →
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

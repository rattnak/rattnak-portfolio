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
        whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
        transition={{ duration: 0.2 }}
        className="card group cursor-pointer"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap text-xs">
            <span className="uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              {type}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span className="font-medium" style={{ color: 'var(--accent-primary)' }}>
              {result}
            </span>
            {featured && (
              <>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: 'var(--accent-primary)' }}>
                  Featured
                </span>
              </>
            )}
          </div>

          <h3
            className="text-xl font-semibold transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            {name}
          </h3>

          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {description}
          </p>

          {organizer && (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {organizer}
            </p>
          )}

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.slice(0, 4).map((tag, idx) => (
                <Tag key={idx} size="sm">
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          <div className="flex items-center gap-6 pt-2 text-sm">
            <span style={{ color: 'var(--text-muted)' }}>
              {new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="transition-colors"
                style={{ color: 'var(--accent-primary)' }}
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

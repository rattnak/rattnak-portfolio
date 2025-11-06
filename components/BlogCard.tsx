// components/BlogCard.tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Tag from "./Tag";

type Props = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string | null;
  tags?: string[];
  readTime?: number | null;
  publishedAt: Date | string | null;
};

export default function BlogCard({
  title,
  slug,
  excerpt,
  coverImage,
  tags,
  readTime,
  publishedAt,
}: Props) {
  return (
    <Link href={`/blog/${slug}`} className="block">
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="card group cursor-pointer"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <div className="blog-card-content">
          <div className="flex items-center" style={{ gap: '0.5rem', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{
              color: 'var(--text-muted)',
              fontWeight: 500
            }}>
              {publishedAt
                ? new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : "Draft"}
            </span>
            {readTime && (
              <>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{
                  color: 'var(--text-muted)',
                  fontWeight: 500
                }}>
                  {readTime} min read
                </span>
              </>
            )}
          </div>

          <h3 className="project-card-title">
            {title}
          </h3>

          {tags && tags.length > 0 && (
            <div className="flex items-center overflow-hidden project-card-tags" style={{ marginTop: '0.75rem', marginBottom: '0.75rem', pointerEvents: 'none', flexWrap: 'nowrap' }}>
              {tags.slice(0, 3).map((tag, idx) => (
                <Tag key={idx} size="sm">
                  {tag}
                </Tag>
              ))}
              {tags.length > 3 && (
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  marginLeft: '0.25rem',
                  flexShrink: 0
                }}>
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          <p className="project-card-description">
            {excerpt}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

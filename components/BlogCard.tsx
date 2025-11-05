// components/BlogCard.tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";

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
        whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
        transition={{ duration: 0.2 }}
        className="card group cursor-pointer"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs">
            <span style={{ color: 'var(--text-muted)' }}>
              {publishedAt
                ? new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : "Draft"}
            </span>
            {readTime && (
              <>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {readTime} min read
                </span>
              </>
            )}
          </div>

          <h3
            className="text-xl font-semibold transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h3>

          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {excerpt}
          </p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: 'var(--background-secondary)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

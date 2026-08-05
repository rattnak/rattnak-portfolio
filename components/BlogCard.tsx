// components/BlogCard.tsx
"use client";
import Link from "next/link";
import Tag from "./Tag";

type TagType = {
  id: number;
  name: string;
  color: string | null;
};

type Props = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string | null;
  tags?: string[];
  tagList?: TagType[];
  readTime?: number | null;
  publishedAt: Date | string | null;
};

export default function BlogCard({
  title,
  slug,
  excerpt,
  tags,
  tagList,
  readTime,
  publishedAt,
}: Props) {
  return (
    <div className="card group" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="project-card-content">
        {/* Category leads the meta row (matches Project/Achievement/OSS cards);
            date and read time follow as the distinguishing facts. */}
        <div className="flex items-center project-card-meta">
          <span className="project-card-meta-type">Blog</span>
          <span className="project-card-meta-separator">•</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
            {publishedAt
              ? new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : "Draft"}
          </span>
          {readTime && (
            <>
              <span className="project-card-meta-separator">•</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                {readTime} min read
              </span>
            </>
          )}
        </div>

        <h3 className="project-card-title">
          <Link href={`/blog/${slug}`} className="stretched-link">
            {title}
          </Link>
        </h3>

        <p className="project-card-description">
          {excerpt}
        </p>

        {tagList && tagList.length > 0 ? (
          <div className="flex items-center overflow-hidden project-card-tags" style={{ marginTop: '0.75rem', marginBottom: '0.75rem', flexWrap: 'nowrap' }}>
            {tagList.slice(0, 3).map((tag) => (
              <Tag key={tag.id} size="sm" color={tag.color}>
                {tag.name}
              </Tag>
            ))}
            {tagList.length > 3 && (
              <span className="project-card-tag-count">+{tagList.length - 3}</span>
            )}
          </div>
        ) : tags && tags.length > 0 ? (
          <div className="flex items-center overflow-hidden project-card-tags" style={{ marginTop: '0.75rem', marginBottom: '0.75rem', flexWrap: 'nowrap' }}>
            {tags.slice(0, 3).map((tag, idx) => (
              <Tag key={idx} size="sm">
                {tag}
              </Tag>
            ))}
            {tags.length > 3 && (
              <span className="project-card-tag-count">+{tags.length - 3}</span>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

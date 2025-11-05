// components/ProjectCard.tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Tag from "./Tag";

type ProjectType = "CODING" | "CASE_STUDY";

type Props = {
  id: number;
  name: string;
  description: string;
  url: string;
  type: ProjectType;
  tags?: string[];
  imageUrl?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  startDate: Date | string;
  endDate?: Date | string | null;
};

export default function ProjectCard({
  id,
  name,
  description,
  url,
  type,
  tags,
  imageUrl,
  githubUrl,
  liveUrl,
  featured,
  startDate,
  endDate,
}: Props) {
  const displayDate = endDate
    ? new Date(endDate).toLocaleDateString()
    : new Date(startDate).toLocaleDateString();

  return (
    <Link href={`/projects/${id}`} className="block">
      <motion.div
        whileHover={{ y: -6, boxShadow: 'var(--shadow-xl)' }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="card group cursor-pointer"
      >
        {imageUrl && (
          <div
            className="w-full aspect-[16/9] overflow-hidden rounded-lg mb-6"
            style={{ backgroundColor: 'var(--background-secondary)' }}
          >
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              {type === "CODING" ? "Development" : "Design"}
            </span>
            {featured && (
              <span className="text-xs" style={{ color: 'var(--accent-primary)' }}>
                Featured
              </span>
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
            {type === "CODING" && githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="transition-colors"
                style={{ color: 'var(--accent-primary)' }}
              >
                GitHub →
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="transition-colors"
                style={{ color: 'var(--accent-primary)' }}
              >
                Live →
              </a>
            )}
            {type === "CASE_STUDY" && url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="transition-colors"
                style={{ color: 'var(--accent-primary)' }}
              >
                View Case →
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

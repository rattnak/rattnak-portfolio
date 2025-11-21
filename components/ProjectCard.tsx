// components/ProjectCard.tsx
"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Tag from "./Tag";

type ProjectType = "CODING" | "CASE_STUDY";

type TagType = {
  id: number;
  name: string;
  color: string | null;
};

type Props = {
  id: number;
  name: string;
  excerpt?: string | null;
  description: string;
  url: string | null;
  type: ProjectType;
  tags?: string[];
  tagList?: TagType[]; 
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
  excerpt,
  description,
  url,
  type,
  tagList,
  imageUrl,
  githubUrl,
  liveUrl,
  featured,
  startDate,
  endDate,
}: Props) {
  const router = useRouter();
  const displayDate = endDate
    ? new Date(endDate).toLocaleDateString()
    : new Date(startDate).toLocaleDateString();

  const handleCardClick = () => {
    router.push(`/projects/${id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="card group cursor-pointer"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      onClick={handleCardClick}
    >
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
          {imageUrl && (
            <div className="project-card-image">
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          <div className="project-card-content">
            <div className="flex items-center project-card-meta">
              <span style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
                fontWeight: 500
              }}>
                {type === "CODING" ? "Development" : "Design"}
              </span>
              {featured && (
                <>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span style={{
                    fontSize: '0.75rem',
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

          <p className="project-card-description">
            {excerpt || description}
          </p>

          {tagList && tagList.length > 0 && (
            <div className="flex items-center overflow-hidden project-card-tags" style={{ marginTop: '0.75rem', marginBottom: '0.75rem', flexWrap: 'nowrap' }}>
              {tagList.slice(0, 3).map((tag) => (
                <Tag key={tag.id} size="sm">
                  {tag.name}
                </Tag>
              ))}
              {tagList.length > 3 && (
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  marginLeft: '0.25rem',
                  flexShrink: 0
                }}>
                  +{tagList.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center project-card-links">
            {type === "CODING" && githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="transition-colors"
                style={{ color: 'var(--accent-primary)', fontWeight: 500 }}
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
                style={{ color: 'var(--accent-primary)', fontWeight: 500 }}
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
                style={{ color: 'var(--accent-primary)', fontWeight: 500 }}
              >
                View Case →
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

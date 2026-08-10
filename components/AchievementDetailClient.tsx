// components/AchievementDetailClient.tsx
"use client";
import Tag from "./Tag";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Slideshow from "./Slideshow";
import BackLink from "./BackLink";

type Achievement = {
  id: number;
  name: string;
  type: string;
  description: string;
  content?: string | null;
  result: string;
  organizer?: string | null;
  url?: string | null;
  tags?: string[];
  date: Date | string;
  featured?: boolean;
};

type Props = {
  achievement: Achievement;
};

export default function AchievementDetailClient({ achievement }: Props) {
  return (
    <div style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <BackLink href="/achievements" label="Back to Achievements" sticky />

      <div className="container" style={{
        paddingTop: '0',
        paddingBottom: '4rem',
        maxWidth: '80rem'
      }}>

        {/* Achievement header */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="flex items-center" style={{ gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              fontWeight: 500
            }}>
              {achievement.type}
            </span>
            {achievement.featured && (
              <>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--accent-primary)'
                }}>
                  Featured
                </span>
              </>
            )}
          </div>

          <h1 style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '1rem',
            lineHeight: 1.2,
            letterSpacing: '-0.02em'
          }}>
            {achievement.name}
          </h1>

          <div className="flex flex-wrap items-center" style={{ gap: '1rem', marginBottom: '1rem' }}>
            <div className="flex items-start" style={{ gap: '0.5rem' }}>
              <svg style={{ width: '1.25rem', height: '1.25rem', color: '#f59e0b', flexShrink: 0, marginTop: '0.125rem' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.0625rem', lineHeight: 1.4 }}>
                {achievement.result}
              </span>
            </div>
            {achievement.organizer && (
              <>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem' }}>
                  {achievement.organizer}
                </span>
              </>
            )}
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem' }}>
              {new Date(achievement.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <p style={{
            fontSize: '1.0625rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            marginBottom: '1.5rem'
          }}>
            {achievement.description}
          </p>

          {/* Action button */}
          {achievement.url && (
            <div className="flex flex-wrap" style={{ gap: '1rem' }}>
              <a
                href={achievement.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Details
              </a>
            </div>
          )}
        </div>

        {/* Achievement details - Two column layout on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr]" style={{ gap: '3rem' }}>
          {/* Left Column - Metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Date section */}
            <section>
              <h2 className="detail-section-title">
                Date
              </h2>
              <p style={{
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: 'var(--text-primary)'
              }}>
                {new Date(achievement.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </section>

            {/* Type & Result section */}
            <section>
              <h2 className="detail-section-title">
                Achievement
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <p style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.25rem'
                  }}>
                    Type
                  </p>
                  <p style={{
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)'
                  }}>
                    {achievement.type}
                  </p>
                </div>
                <div>
                  <p style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.25rem'
                  }}>
                    Result
                  </p>
                  <div className="flex items-start" style={{ gap: '0.5rem' }}>
                    <svg style={{ width: '1.125rem', height: '1.125rem', color: '#f59e0b', flexShrink: 0, marginTop: '0.125rem' }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <p style={{
                      lineHeight: 1.4,
                      fontSize: '0.9375rem',
                      fontWeight: 500,
                      color: 'var(--text-primary)'
                    }}>
                      {achievement.result}
                    </p>
                  </div>
                </div>
                {achievement.organizer && (
                  <div>
                    <p style={{
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)',
                      marginBottom: '0.25rem'
                    }}>
                      Organizer
                    </p>
                    <p style={{
                      fontSize: '0.9375rem',
                      fontWeight: 500,
                      color: 'var(--text-primary)'
                    }}>
                      {achievement.organizer}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Tags section */}
            {achievement.tags && achievement.tags.length > 0 && (
              <section>
                <h2 className="detail-section-title">
                  Skills
                </h2>
                <div className="flex flex-wrap" style={{ gap: '0.5rem' }}>
                  {achievement.tags.map((tag, idx) => (
                    <Tag key={idx} size="sm">
                      {tag}
                    </Tag>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Content */}
          <div>
            {achievement.content && (
              <section>
                <h2 className="detail-section-title">
                  Overview
                </h2>
                <article
                  className="prose-custom"
                  style={{
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({node, ...props}) => (
                        <h2 style={{
                          fontSize: '1.5rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          marginTop: '2.5rem',
                          marginBottom: '1rem',
                          lineHeight: 1.3
                        }} {...props} />
                      ),
                      h3: ({node, ...props}) => (
                        <h3 style={{
                          fontSize: '1.25rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          marginTop: '2rem',
                          marginBottom: '0.75rem',
                          lineHeight: 1.3
                        }} {...props} />
                      ),
                      p: ({node, ...props}) => (
                        <p style={{
                          fontSize: '1rem',
                          lineHeight: 1.7,
                          color: 'var(--text-secondary)',
                          marginBottom: '1.25rem'
                        }} {...props} />
                      ),
                      ul: ({node, ...props}) => (
                        <ul style={{
                          fontSize: '1rem',
                          lineHeight: 1.7,
                          color: 'var(--text-secondary)',
                          marginBottom: '1.25rem',
                          paddingLeft: '1.5rem',
                          listStyleType: 'disc'
                        }} {...props} />
                      ),
                      ol: ({node, ...props}) => (
                        <ol style={{
                          fontSize: '1rem',
                          lineHeight: 1.7,
                          color: 'var(--text-secondary)',
                          marginBottom: '1.25rem',
                          paddingLeft: '1.5rem',
                          listStyleType: 'decimal'
                        }} {...props} />
                      ),
                      li: ({node, ...props}) => (
                        <li style={{
                          marginBottom: '0.5rem'
                        }} {...props} />
                      ),
                      strong: ({node, ...props}) => (
                        <strong style={{
                          fontWeight: 600,
                          color: 'var(--text-primary)'
                        }} {...props} />
                      ),
                      a: ({node, ...props}) => (
                        <a style={{
                          color: 'var(--accent-primary)',
                          textDecoration: 'underline',
                          transition: 'color 0.2s'
                        }} {...props} />
                      ),
                      img: ({node, alt, ...props}) => (
                        <img
                          alt={alt}
                          style={{
                            width: '100%',
                            borderRadius: '0.75rem',
                            border: '1px solid var(--border)',
                            marginTop: '0.5rem',
                            marginBottom: '1.5rem'
                          }}
                          {...props}
                        />
                      ),
                      // ```slideshow fenced code block: one image path per line,
                      // renders as an interactive Slideshow instead of a code block.
                      code: ({node, className, children, ...props}) => {
                        if (className === 'language-slideshow') {
                          const images = String(children)
                            .split('\n')
                            .map((line) => line.trim())
                            .filter(Boolean);
                          return <Slideshow images={images} alt={achievement.name} />;
                        }
                        return <code className={className} {...props}>{children}</code>;
                      },
                      // Unwrap the <pre> that ReactMarkdown puts around fenced code blocks
                      // when it's our slideshow block, since Slideshow isn't code text.
                      pre: ({node, children, ...props}) => {
                        const child = node?.children?.[0];
                        const isSlideshow =
                          child &&
                          'tagName' in child &&
                          child.tagName === 'code' &&
                          Array.isArray((child as any).properties?.className) &&
                          (child as any).properties.className.includes('language-slideshow');
                        if (isSlideshow) {
                          return <>{children}</>;
                        }
                        return <pre {...props}>{children}</pre>;
                      },
                    }}
                  >
                    {achievement.content}
                  </ReactMarkdown>
                </article>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

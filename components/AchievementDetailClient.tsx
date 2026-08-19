// components/AchievementDetailClient.tsx
// Same shell as the Project and Open Source detail pages (2026-08-12):
// condensing sticky header holding the back link, meta line, and a
// title + actions row, then a TL;DR callout over the body. Only the body
// differs, because achievements carry markdown content where projects
// carry an HTML overview and open source carries a PR list.
"use client";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import DeckEmbed from "./DeckEmbed";
import Breadcrumb from "./Breadcrumb";
import remarkGfm from "remark-gfm";
import Slideshow from "./Slideshow";
import ArchDiagram, { parseArchSpec } from "./ArchDiagram";
import { getAchievementLinks, WORK_CATEGORY_META, type AchievementLink } from "@/lib/database";

const ExternalIcon = () => (
  <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

type Achievement = {
  id: number;
  name: string;
  type: string;
  description: string;
  content?: string | null;
  result: string;
  organizer?: string | null;
  url?: string | null;
  links?: AchievementLink[] | null;
  // A deck among the links renders as an inline viewer after the body,
  // matching the project detail page. The ```deck fence still works for
  // decks authored inside the markdown itself.
  deckUrl?: string | null;
  tags?: string[];
  date: Date | string;
  featured?: boolean;
};

type Props = {
  achievement: Achievement;
};

export default function AchievementDetailClient({ achievement }: Props) {
  // Up to 3 labeled links (getAchievementLinks falls back to the legacy
  // single `url` column when `links` isn't set), rendered as the header's
  // action buttons, the slot GitHub/Live occupy on the other two pages.
  const links = getAchievementLinks(achievement);
  const dateLabel = new Date(achievement.date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Condensed sticky header, identical mechanism to Project and Open
  // Source: a zero-height sentinel marks the header's natural position,
  // and the header switches to its slim pinned form once that scrolls
  // under the navbar.
  const [condensed, setCondensed] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCondensed(!entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px", threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const actions = links.length > 0 && (
    <div className="flex flex-wrap project-detail-actions" style={{ gap: condensed ? "0.5rem" : "0.75rem" }}>
      {links.map((link, i) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          // First link is the primary action, matching how the other
          // detail pages weight Live Website over View on GitHub.
          className={
            condensed
              ? "btn-icon"
              : `btn ${i === 0 ? "btn-primary" : "btn-secondary"} group btn-icon-mobile`
          }
          aria-label={condensed ? link.label : undefined}
          title={condensed ? link.label : undefined}
        >
          <ExternalIcon />
          {!condensed && <span className="btn-icon-mobile-label">{link.label}</span>}
        </a>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: "calc(100vh - 4rem)" }}>
      <div className={`project-detail-sticky ${condensed ? "project-detail-sticky-condensed" : ""}`}>
        <div className="container project-detail-sticky-inner">
          <Breadcrumb
            condensed={condensed}
            trail={[
              { label: "Work", href: "/#work" },
              WORK_CATEGORY_META.leadership,
              { label: achievement.name },
            ]}
          />

          {/* Meta line: result in accent, then organizer and date. */}
          {!condensed && (
            <div
              className="instrument flex items-center flex-wrap"
              style={{
                gap: "0.5rem",
                fontSize: "var(--text-xs)",
                color: "var(--text-muted)",
                marginBottom: "1rem",
              }}
            >
              <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
                {achievement.result}
              </span>
              {achievement.organizer && (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <span>{achievement.organizer}</span>
                </>
              )}
              <span aria-hidden="true">&middot;</span>
              <span>{dateLabel}</span>
            </div>
          )}

          <div className="project-detail-title-row">
            <h1 className={condensed ? "project-detail-title-condensed" : "project-detail-title"}>
              {achievement.name}
            </h1>
            {actions}
          </div>
        </div>
      </div>

      <div ref={sentinelRef} style={{ height: 0 }} />

      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        {/* Same TL;DR callout the project page uses, so the one-line
            summary reads as a distinct element rather than as the first
            paragraph of the body. */}
        <div className="project-detail-tldr" style={{ marginBottom: "2.5rem" }}>
          <span className="instrument-label project-detail-tldr-mark">TL;DR</span>
          <p style={{ margin: 0 }}>{achievement.description}</p>
        </div>

        {achievement.content && (
          <article
            className="prose-custom"
            style={{
              color: "var(--text-secondary)",
              lineHeight: 1.7,
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({node, ...props}) => (
                  <h2 style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginTop: '2.5rem',
                    marginBottom: '1rem',
                    lineHeight: 1.3
                  }} {...props} />
                ),
                h3: ({node, ...props}) => (
                  <h3 style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginTop: '2rem',
                    marginBottom: '0.75rem',
                    lineHeight: 1.3
                  }} {...props} />
                ),
                p: ({node, ...props}) => (
                  <p style={{
                    fontSize: 'var(--text-base)',
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)',
                    marginBottom: '1.25rem'
                  }} {...props} />
                ),
                ul: ({node, ...props}) => (
                  <ul style={{
                    fontSize: 'var(--text-base)',
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)',
                    marginBottom: '1.25rem',
                    paddingLeft: '1.5rem',
                    listStyleType: 'disc'
                  }} {...props} />
                ),
                ol: ({node, ...props}) => (
                  <ol style={{
                    fontSize: 'var(--text-base)',
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
                // Body images render at their own size, not stretched to the
                // column. A screenshot narrower than the text column was
                // previously scaled up to fill it, which softens the pixels
                // and crops nothing but lies about the original dimensions.
                // maxWidth caps oversized images without enlarging small ones.
                img: ({node, alt, ...props}) => (
                  <img
                    alt={alt}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: '0.75rem',
                      border: '1px solid var(--border)',
                      marginTop: '0.5rem',
                      marginBottom: '1.5rem'
                    }}
                    {...props}
                  />
                ),
                // Custom fenced blocks, mirroring each other's pattern:
                // ```slideshow: one image path per line, renders a Slideshow.
                // ```architecture: JSON spec, renders an interactive ArchDiagram.
                // ```diff: +/- prefixed lines colored via tokens.
                // ```deck: a share URL, optionally a label on the next line,
                //           renders an embedded Canva / Google Slides / PDF.
                code: ({node, className, children, ...props}) => {
                  if (className === 'language-deck') {
                    const [url, ...rest] = String(children)
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean);
                    if (url) return <DeckEmbed url={url} label={rest.join(' ') || undefined} />;
                  }
                  if (className === 'language-slideshow') {
                    const images = String(children)
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean);
                    return <Slideshow images={images} alt={achievement.name} />;
                  }
                  if (className === 'language-architecture') {
                    const spec = parseArchSpec(String(children));
                    if (spec) return <ArchDiagram spec={spec} />;
                    // Invalid JSON: fall through to a normal code block
                    // so the authoring mistake is visible, not hidden.
                  }
                  if (className === 'language-diff') {
                    const lines = String(children).replace(/\n$/, '').split('\n');
                    return (
                      <span className="diff-block">
                        {lines.map((line, i) => {
                          const cls = line.startsWith('+')
                            ? 'diff-line-add'
                            : line.startsWith('-')
                              ? 'diff-line-del'
                              : undefined;
                          return (
                            <span key={i} className={cls}>
                              {line || ' '}
                              {'\n'}
                            </span>
                          );
                        })}
                      </span>
                    );
                  }
                  return <code className={className} {...props}>{children}</code>;
                },
                // Unwrap the <pre> that ReactMarkdown puts around fenced code
                // blocks when the fence renders a component, not code text.
                pre: ({node, children, ...props}) => {
                  const child = node?.children?.[0];
                  const fenceOf = (name: string) =>
                    child &&
                    'tagName' in child &&
                    child.tagName === 'code' &&
                    Array.isArray((child as any).properties?.className) &&
                    (child as any).properties.className.includes(`language-${name}`);
                  if (fenceOf('slideshow') || fenceOf('architecture') || fenceOf('diff') || fenceOf('deck')) {
                    return <>{children}</>;
                  }
                  return <pre {...props}>{children}</pre>;
                },
              }}
            >
              {achievement.content}
            </ReactMarkdown>
          </article>
        )}

        {achievement.deckUrl && (
          <section style={{ marginTop: '2.5rem' }}>
            <h2 className="project-detail-section-title">Presentation</h2>
            <DeckEmbed url={achievement.deckUrl} label={`${achievement.name} deck`} />
          </section>
        )}
      </div>
    </div>
  );
}

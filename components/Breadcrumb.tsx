// components/Breadcrumb.tsx
// The detail pages' top layer: a Back control plus a trail naming where
// you are. Replaces the old "Back to work" link, which did two jobs
// badly: it never said where you were, and it always went to /#work
// regardless of how you arrived.
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type Crumb = {
  label: string;
  href?: string; // omitted on the current page
};

type Props = {
  trail: Crumb[];
  // Where Back goes when there is no in-site history to return to.
  fallbackHref?: string;
  condensed?: boolean;
};

export default function Breadcrumb({ trail, fallbackHref = "/#work", condensed = false }: Props) {
  const router = useRouter();
  // Whether router.back() will land somewhere inside this site. Starts
  // false so the server render and the first client render agree (the
  // checks below can only run in the browser), then flips on mount.
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Two conditions, both required. history.length > 1 means this tab
    // has somewhere to go back to at all; a same-origin referrer means
    // that somewhere is this site rather than a search engine or
    // another domain. A cold load from a shared link satisfies neither,
    // and going "back" there would either do nothing or leave the site,
    // so the control stays a plain link to the grid instead.
    if (typeof window === "undefined") return;
    if (window.history.length <= 1) return;
    const ref = document.referrer;
    if (!ref) return;
    try {
      if (new URL(ref).origin === window.location.origin) setCanGoBack(true);
    } catch {
      // Malformed referrer: treat as untrusted and keep the fallback.
    }
  }, []);

  const backIcon = (
    <svg className="back-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );

  return (
    <div className={`breadcrumb-bar ${condensed ? "breadcrumb-bar-condensed" : ""}`}>
      {canGoBack ? (
        <button
          type="button"
          onClick={() => router.back()}
          className="breadcrumb-back"
          aria-label="Go back"
          title="Go back"
        >
          {backIcon}
        </button>
      ) : (
        <Link href={fallbackHref} className="breadcrumb-back" aria-label="Back to work" title="Back to work">
          {backIcon}
        </Link>
      )}

      {/* A real breadcrumb landmark and ordered list, so it is announced
          as a trail rather than as a run of unrelated links. */}
      <nav aria-label="Breadcrumb" className="breadcrumb-nav">
        <ol className="breadcrumb-list instrument">
          {trail.map((crumb, i) => {
            const isLast = i === trail.length - 1;
            return (
              <li key={`${crumb.label}-${i}`} className="breadcrumb-item">
                {crumb.href && !isLast ? (
                  <Link href={crumb.href} className="breadcrumb-link">
                    {crumb.label}
                  </Link>
                ) : (
                  // The current page is text, not a link: linking to
                  // where you already are is a dead control.
                  <span className="breadcrumb-current" aria-current="page">
                    {crumb.label}
                  </span>
                )}
                {!isLast && (
                  <span className="breadcrumb-sep" aria-hidden="true">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

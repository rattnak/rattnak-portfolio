// components/BackLink.tsx
"use client";
import Link from "next/link";

type Props = {
  href: string;
  label: string;
  /** Pin to the top of the viewport with a solid background, for wide two-column detail layouts. */
  sticky?: boolean;
};

export default function BackLink({ href, label, sticky = false }: Props) {
  const link = (
    <Link href={href} className="back-link">
      <svg
        className="back-link-icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </Link>
  );

  if (!sticky) {
    return <div className="back-link-wrap">{link}</div>;
  }

  // .back-link-sticky-inner carries the "container" class, so its width
  // always matches the page content below it (1100px, same as every
  // other page) rather than a per-page override that can drift.
  return (
    <div className="back-link-sticky">
      <div className="container back-link-sticky-inner">{link}</div>
    </div>
  );
}

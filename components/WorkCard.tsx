// components/WorkCard.tsx
// One light card for every kind of work: cover (or typographic
// fallback), title, one pitch line, lowercase category words, mono
// date. Server component; the whole card is a single link.
import Link from "next/link";
import type { WorkItem } from "@/lib/database";

export default function WorkCard({ item }: { item: WorkItem }) {
  const body = (
    <>
      <div className="work-card-cover">
        {item.cover ? (
          <img src={item.cover} alt={item.title} loading="lazy" />
        ) : (
          <span className="work-card-cover-fallback instrument" aria-hidden="true">
            {item.coverFallback}
          </span>
        )}
        {/* Not aria-hidden: featured is real information, and the grid
            already sorts on it, so the badge is what explains an
            ordering that would otherwise be unexplained. One word keeps
            it short, since the whole card is one link and this joins
            its accessible name. */}
        {item.featured && (
          <span className="work-card-featured instrument">Featured</span>
        )}
      </div>
      <h3 className="work-card-title">{item.title}</h3>
      {item.pitch && <p className="work-card-pitch">{item.pitch}</p>}
      <div className="work-card-cats instrument">
        {item.categories.map((cat) => (
          <span key={cat} className="work-cat" data-cat={cat}>
            {cat}
          </span>
        ))}
      </div>
      <div className="work-card-date instrument">{item.dateLabel}</div>
    </>
  );

  if (!item.href) {
    return <div className="work-card">{body}</div>;
  }

  if (item.external) {
    return (
      <a className="work-card" href={item.href} target="_blank" rel="noreferrer">
        {body}
      </a>
    );
  }

  return (
    <Link className="work-card" href={item.href}>
      {body}
    </Link>
  );
}

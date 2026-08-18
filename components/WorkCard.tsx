// components/WorkCard.tsx
// One light card for every kind of work: cover (or typographic
// fallback), title, one pitch line, lowercase category words, mono
// date. Server component; the whole card is a single link.
import Link from "next/link";
import Tag from "./Tag";
import type { WorkItem } from "@/lib/database";

// Skills share one line with the date and must never wrap: a second row
// pushes the card taller than its neighbours and breaks the grid's rhythm.
// Rather than counting characters, the row is clipped by CSS and the "+N"
// marker is pinned outside the scrolling area, so the cut is always clean
// whatever the skill names happen to be.
//
// The cap here is a ceiling on how many can ever be laid out, not a promise
// that all of them fit; CSS decides what is actually visible.
const MAX_CARD_SKILLS = 4;

export default function WorkCard({ item }: { item: WorkItem }) {
  const shownSkills = item.skills.slice(0, MAX_CARD_SKILLS);
  // The marker counts every skill, not just the hidden ones: it reads as
  // "this work has 5 skills, here is the start of the list", and the whole
  // card already links to the detail page where all of them are listed.
  const totalSkills = item.skills.length;
  const hasMore = totalSkills > shownSkills.length;
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
      <div className="work-card-meta">
        <span className="work-card-date instrument">{item.dateLabel}</span>
        {/* The same Tag component the detail pages use, so a skill is the
            same color everywhere it appears. Colors come from the shared
            WCAG-AA palette in lib/tagColors.ts, keyed by name. */}
        {shownSkills.length > 0 && (
          <span className="work-card-skills">
            <span className="work-card-skills-track">
              {shownSkills.map((skill) => (
                <Tag key={skill} size="sm">
                  {skill}
                </Tag>
              ))}
            </span>
            {hasMore && (
              <span
                className="work-card-skill-more instrument"
                title={item.skills.join(", ")}
              >
                +{totalSkills}
              </span>
            )}
          </span>
        )}
      </div>
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

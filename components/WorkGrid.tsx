// components/WorkGrid.tsx
// The one list on the site: projects, curated open source, and
// achievements merged into a featured-first card grid, with the
// GitHub activity strip as its instrument footer.
import { getWorkItems } from "@/lib/database";
import { getRecentActivity } from "@/lib/github";
import WorkGridClient from "./WorkGridClient";

function relativeTime(date: string): string {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1mo ago" : `${months}mo ago`;
}

export default async function WorkGrid() {
  const items = await getWorkItems();
  const activity = await getRecentActivity();

  if (items.length === 0) return null;

  return (
    // No top padding: the hero above fills exactly one viewport, so this
    // section's ledger-rule line sits right at the fold, visible at the
    // bottom edge of the first screen as a cue that there's more below.
    <section id="work" className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <WorkGridClient items={items} />

        {activity.length > 0 && (
          <div className="oss-activity-strip">
            <p className="instrument-label oss-activity-title">recent activity</p>
            <ul className="instrument oss-activity-list">
              {activity.map((item, i) => (
                <li key={i}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="link-text">
                    {item.kind === "pr" ? "PR" : "push"} &middot; {item.repo} &middot; {item.title}
                  </a>
                  <span className="oss-activity-date">{relativeTime(item.date)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

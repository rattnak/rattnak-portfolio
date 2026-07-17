// components/WorkGridClient.tsx
// The work section header, its category filter, and the filtered card
// grid. The filter is a mono instrument rail (revised 2026-08-11 from
// the old underlined tab row): each chip carries the category's own
// accent dot and a live count, so the control reads as part of the
// instrumented system and tells you what is behind it before you click.
// Categories with no items never render a dead chip.
"use client";
import { useEffect, useState } from "react";
import { WORK_CATEGORY_META, type WorkCategory, type WorkItem } from "@/lib/database";
import WorkCard from "./WorkCard";

type Filter = WorkCategory | "ALL";

const TABS: { key: Filter; label: string }[] = [
  { key: "ALL", label: "all" },
  { key: "develop", label: "development" },
  { key: "design", label: "design" },
  { key: "opensource", label: "open source" },
  { key: "leadership", label: "leadership" },
];

const CATEGORY_KEYS = Object.keys(WORK_CATEGORY_META) as WorkCategory[];

// Detail pages' breadcrumbs link back to /#work-<category>, so arriving
// with that hash should land on the grid with that filter applied.
function categoryFromHash(): WorkCategory | null {
  const hash = window.location.hash.replace(/^#/, "");
  return CATEGORY_KEYS.find((key) => hash === `work-${key}`) ?? null;
}

export default function WorkGridClient({ items }: { items: WorkItem[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");

  // Runs on mount and on every later hashchange: following a breadcrumb
  // to the page you are already on changes the hash without remounting,
  // so mount alone would miss it.
  useEffect(() => {
    const sync = () => {
      const fromHash = categoryFromHash();
      if (fromHash) setFilter(fromHash);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const countFor = (key: Filter) =>
    key === "ALL" ? items.length : items.filter((item) => item.categories.includes(key)).length;

  const tabs = TABS.filter((tab) => countFor(tab.key) > 0);
  const visible =
    filter === "ALL" ? items : items.filter((item) => item.categories.includes(filter));

  return (
    <>
      {/* Scroll targets for the breadcrumb's category links. Empty and
          zero-height: they exist only so /#work-develop lands in the
          same place /#work does, while the hash tells the grid above
          which chip to select. */}
      {CATEGORY_KEYS.map((key) => (
        <span key={key} id={`work-${key}`} className="work-anchor" aria-hidden="true" />
      ))}

      <div className="ledger-rule">
        <span className="instrument-label ledger-rule-label">work</span>
        {/* Right side of the rule doubles as the readout for the
            current filter, so the count is not duplicated below. */}
        <span className="instrument ledger-rule-readout">
          {visible.length} {visible.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* The rail and the grid share one wrapper so `position: sticky`
          on the rail is scoped to it: the rail pins under the navbar
          while the grid scrolls, then releases at the end of the grid
          instead of floating on over the next section. */}
      <div className="work-sticky-scope">
        <div className="work-filter-bar">
          <div className="work-filter" role="group" aria-label="Filter work by category">
            {tabs.map((tab) => {
              const active = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`work-filter-chip ${active ? "active" : ""}`}
                  data-category={tab.key}
                  aria-pressed={active}
                >
                  <span className="work-filter-dot" aria-hidden="true" />
                  <span className="work-filter-label">{tab.label}</span>
                  <span className="work-filter-count">{countFor(tab.key)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Work Grid */}
        {visible.length === 0 ? (
          <div className="empty-state">
            <p>No work found in this category.</p>
          </div>
        ) : (
          <div className="grid-3">
            {visible.map((item) => (
              <WorkCard key={item.key} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

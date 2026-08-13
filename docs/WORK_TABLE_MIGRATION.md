# Merging Project + Achievement into `Work`, and moving skills to a string array

## What changes

Three decisions drive this plan:

1. **Project and Achievement merge into one `Work` table** with a multi-valued
   `categories` column, so a row can be develop *and* design *and* leadership at once,
   including `OPEN_SOURCE` when a piece of work is a contribution as well.
2. **OpenSourceContribution stays its own table, structurally unchanged.** It keeps one
   row per PR, so the merged-PR counts and the PR list on the detail page survive. It
   gains a `skills` array and the new link columns, nothing else.
3. **The Tag tables go away.** Skills become a plain `String[]` column on both tables,
   with `lib/tagColors.ts` as the canonical skill list. Adding a skill means typing it
   into the array; it renders immediately in the default grey, and gets a color when the
   name is added to `tagColors.ts` later.

## Why the tag tables can go

`components/Tag.tsx` already ignores database colors. Its `color` prop is marked
deprecated and unused: every tag looks up its color by *name* from `TAG_COLORS` in
`lib/tagColors.ts`, falling back to `DEFAULT_TAG_COLOR` (grey) for unknown names.

So the 82-row `Tag` table, its `color` column, and the two junctions contribute nothing
the rendering path reads. They cost two joins per query and a foreign key that blocks
typing a new skill. A `String[]` column removes all of that and matches how the colors
already work: name is the key.

Evidence this is safe: `AchievementTag` has **0 rows** today. All 9 achievements already
store skills in a legacy `tags` string array, which is exactly the target shape. The
migration generalizes what achievements already do rather than inventing something.

Trade-off, stated plainly: a string array has no referential integrity, so a typo
("Typescript" vs "TypeScript") becomes a silently distinct skill that renders grey
instead of erroring. Mitigation is a `SKILLS` list exported from `tagColors.ts` plus a
validation script (step 6) that reports any skill in the database missing from the
palette. That is a lint-time check rather than a database constraint, which is the right
level here: you want to add a skill by typing it, and a FK is precisely the thing that
would stop you.

## Target schema

```prisma
model Work {
  id          Int            @id @default(autoincrement())
  slug        String         @unique
  name        String
  // Category set, never empty (CHECK). Drives the home-page filter rail.
  // A row can be several at once: {LEADERSHIP, DESIGN}, or
  // {DEVELOP, OPEN_SOURCE} for a contribution that was also a build.
  categories  WorkCategory[]
  // Skills. Free-form by design: any string renders, and names present in
  // lib/tagColors.ts get their palette color. No FK, no junction.
  skills      String[]       @default([])
  // Display sub-label carried over from Achievement.type: "Competition",
  // "Fellowship", "Program", "Delegate", "Venture". Orthogonal to
  // `categories`, which is why it stays its own field.
  kind        String?
  // The two-line card blurb. `.work-card-pitch` clamps to exactly 2 lines
  // and reserves that height, so this is written to fit: roughly 100-160
  // characters. Longer text is not an error, it is silently truncated on
  // the card, which is why it gets its own column instead of sharing one
  // with prose that has no length budget.
  cardBlurb   String?
  // One-sentence summary of the work. Shown on the detail page under the
  // title, and the fallback when `cardBlurb` is null.
  tldr        String
  content     String?        // long body: was Project.overview / Achievement.content
  outcome     String?        // mono result line: was Project.outcome / Achievement.result
  organizer   String?        // was Achievement.organizer
  startDate   DateTime
  endDate     DateTime?      // null for point-in-time work (most achievements)
  // The repo link, on its own column rather than inside `links`. It is the
  // one link with a fixed meaning and a fixed icon, and the only one that
  // renders in the primary accent (teal).
  githubUrl   String?
  // Everything else: live site, case study, certificate, article, talk.
  // Any number of them, each labeled, all rendered in the signal amber so
  // they read as one class of link distinct from the repo.
  // Shape: [{ "label": "Certificate", "url": "https://..." }, ...]
  links       Json?
  imageUrl    String?
  featured    Boolean        @default(false)
  createdAt   DateTime       @default(now())

  @@index([slug])
  @@index([featured])
  @@index([startDate])
  @@index([categories], type: Gin)
  @@index([skills], type: Gin)
}

// Stays separate and stays one row per PR, so mergedCount / totalCount and
// the PR list on the detail page keep working exactly as they do today.
// Rows are still grouped by projectName in code.
model OpenSourceContribution {
  id           Int      @id @default(autoincrement())
  projectName  String
  organization String?
  description  String   // per-PR blurb, shown in the PR list
  prUrl        String?
  merged       Boolean  @default(false)
  date         DateTime
  // Repo link, promoted from `repoUrl` to match Work's naming so both
  // tables render the primary-accent repo link the same way.
  githubUrl    String?
  // Replaces the single `liveUrl`: any number of labeled links, rendered
  // in signal amber. Same shape and same treatment as Work.links.
  links        Json?
  // The capability open source never had: it has no tag junction at all
  // today. Grouped cards union the skills of their contributions.
  skills       String[] @default([])
  imageUrl     String?
  featured     Boolean  @default(false)
  createdAt    DateTime @default(now())

  @@index([date], map: "idx_oss_date")
  @@index([featured], map: "idx_oss_featured")
  @@index([skills], type: Gin)
}

enum WorkCategory {
  DEVELOP
  OPEN_SOURCE
  DESIGN
  LEADERSHIP
}
```

Dropped: `Tag`, `ProjectTag`, `AchievementTag`, `BlogPostTag`, the `TagType` enum, the
`ProjectType` enum, `Project.url` and `Achievement.url` (both fold into `links`), and
`liveUrl` on both tables (also folds into `links`, as one labeled entry among many).

Nothing is dropped from OSS: it keeps `prUrl`, `merged`, and `date`.

## Link colors

Two link roles, two colors, using tokens that already exist in `styles/globals.css`:

| Role | Column | Token | Value |
|---|---|---|---|
| Repo | `githubUrl` | `--accent-primary` | `#0f7b6c` teal (light), `#3ddbb7` (dark) |
| Everything else | `links[]` | `--signal` | `#b45309` amber (light), `#f5a524` (dark) |

Both tokens come from the published redesign plan's color system, which defines exactly
two colors on top of the neutrals: the teal accent and the amber signal. (The token named
`--accent-secondary` was a different, purple value that the same plan deleted; it is not
the amber and is not coming back.)

Both values hold >=4.5:1 on `--background` in their theme, so neither needs contrast work.

**Decided deviation from the redesign plan.** That plan describes amber as "sparing" and
rarer than the accent, scoped to "in progress, warnings, one-off highlights". Using it for
every non-repo link makes it common rather than rare, and it already serves as
`--cat-oss`, the open source category color on cards.

This is a deliberate choice, made 2026-08-12: the two link roles are worth a hard visual
split, and amber carries it. Consequences accepted:

- The "one accent per viewport" rule stops holding on work detail pages, which may show a
  teal repo link and several amber links at once.
- Amber stops reading as "rare" on those pages, so anything that relied on it to mean
  "look here" (in-progress states) needs a different treatment.
- Amber's meaning becomes context-dependent: an open source *category word* and a general
  *link* are the same color in the same card, meaning different things.

Worth a look on screen once the first page is built. The cost lands on how busy a card
with three links looks, which is hard to judge from a spec.

`BlogPost.tags` is already a `String[]`, so blog posts need only the junction dropped,
nothing migrated.

## Column reconciliation

Same concept, different names across the old tables. The merge picks one:

| Concept | Project | Achievement | OSS | Becomes |
|---|---|---|---|---|
| display name | `name` | `name` | `projectName` | `name` / `projectName` |
| one-line summary | `description` | `description` | `description` (per PR) | `tldr` on Work; OSS keeps `description` |
| two-line card blurb | `excerpt` | (none) | (none) | `cardBlurb` on Work |
| result line | `outcome` | `result` | (none) | `outcome` |
| long body | `overview` | `content` | (none) | `content` |
| host org | (none) | `organizer` | `organization` | `organizer` / `organization` |
| date | `startDate`+`endDate` | `date` | `date` (per PR) | `startDate`+`endDate` on Work; OSS keeps `date` |
| repo | `githubUrl` | (none) | `repoUrl` | `githubUrl` on both |
| other links | `url`, `liveUrl` | `url`, `links` | `liveUrl` | `links` on both |
| skills | `ProjectTag` join | `tags` String[] | **nothing** | `skills` String[] |

## Current data

| Table | Rows | Notes |
|---|---|---|
| Project | 8 | all `type = CODING`, so all start as `{DEVELOP}` |
| Achievement | 9 | kinds: Competition x2, Program x3, Delegate x2, Fellowship, Venture |
| OpenSourceContribution | 12 PRs | unchanged; still group into 3 cards: OWASP Nest, OpenLibrary, studio-json-schema |
| ProjectTag | 21 | flatten into `Work.skills` |
| AchievementTag | 0 | empty; achievements use the legacy `tags` array |
| Tag | 82 | dropped after the flatten |

Result: **17 Work rows** (8 + 9) and **3 OpenSourceContribution rows**.

## Migration steps

Steps 1-6 are additive: old tables stay intact and readable, so the site keeps serving
throughout. No step discards row data: the only destructive actions are dropping the tag
tables (step 6, after skills are flattened) and dropping the old tables (step 8, after the
app has run on `Work` in production). Take a database snapshot before each of those.

### 1. Extend `tagColors.ts` into the canonical skill list

Before touching the database, make the TS file authoritative:

```ts
export const SKILLS = Object.keys(TAG_COLORS);
```

Then reconcile it against what the data actually uses. The 82 `Tag` rows and the legacy
achievement arrays contain names the 46-entry palette does not, e.g. `Leadership`,
`Research`, `Project Management`, `Data Analysis`, `Data Visualization`,
`Public Speaking`, `Full-Stack Development`, `Security`, `Community`. Each needs a
palette entry generated at the next golden-angle hue, or a decision to let it render
grey.

Doing this first means no skill silently loses its color during the migration.

### 2. Create `Work` and the `WorkCategory` enum

Includes the `array_length(categories, 1) >= 1` CHECK: a row with no category would
disappear from every filter chip.

### 3. Copy projects into `Work`

`CODING` maps to `{DEVELOP}`, `CASE_STUDY` to `{DESIGN}`; all 8 rows are currently
`CODING`. `overview` becomes `content`, `description` becomes `tldr`, and `excerpt`
becomes `cardBlurb` (it already served exactly that role: `getWorkItems` reads
`p.excerpt ?? p.description` into the card's `pitch`).

Skills come from flattening `ProjectTag`:

```sql
UPDATE "Work" w SET skills = COALESCE((
  SELECT ARRAY_AGG(t.name ORDER BY t.name)
  FROM "ProjectTag" pt JOIN "Tag" t ON t.id = pt."tagId"
  WHERE pt."projectId" = w.legacy_project_id
), '{}');
```

Keep a temporary `legacy_project_id` column for this join; drop it in step 8.

### 4. Copy achievements into `Work`

`date` becomes `startDate` with `endDate` null. `result` becomes `outcome`, `type`
becomes `kind`, `description` becomes `tldr`, `organizer` carries over. Skills come
straight from the legacy `tags` array, already the right shape. Categories start as
`{LEADERSHIP}`, matching today's behavior exactly.

Achievements have no `excerpt`, so `cardBlurb` starts null and the card falls back to
`tldr`. Writing real two-line blurbs for the 9 achievement rows is content work, and the
same pass as step 7.

### 5. Extend OSS in place

No row changes: all 12 PR rows stay, still grouped by `projectName` in code, so
`mergedCount` / `totalCount` and the PR list keep working untouched.

Three additive column changes:

```sql
ALTER TABLE "OpenSourceContribution" ADD COLUMN "skills" TEXT[] DEFAULT '{}';
ALTER TABLE "OpenSourceContribution" RENAME COLUMN "repoUrl" TO "githubUrl";
ALTER TABLE "OpenSourceContribution" ADD COLUMN "links" JSONB;
UPDATE "OpenSourceContribution"
  SET "links" = jsonb_build_array(jsonb_build_object('label', 'Live site', 'url', "liveUrl"))
  WHERE "liveUrl" IS NOT NULL;
ALTER TABLE "OpenSourceContribution" DROP COLUMN "liveUrl";
CREATE INDEX "idx_oss_skills" ON "OpenSourceContribution" USING GIN ("skills");
```

The `repoUrl` -> `githubUrl` rename aligns both tables so the teal repo link renders from
the same field name everywhere. `liveUrl` folds into `links` as one labeled entry.

Skills are per-PR rows, but the card is a group, so the grouped card unions the skills of
its contributions. In practice you will set the same skills across a project's rows;
assigning them is content work in the dashboard afterward.

### 6. Validate skills, then drop the tag tables

Script over both tables: collect every distinct `skills` value, report any not present in
`TAG_COLORS`. Nothing should be unmatched after step 1; anything that is renders grey and
is a content decision, not a failure.

Then drop `ProjectTag`, `AchievementTag`, `BlogPostTag`, `Tag`, and `TagType`. Rerun this
validation in CI so a typo surfaces on the next build.

### 7. Assign real multi-category values

The actual point of the merge, and content review rather than SQL. Every row so far kept
exactly the category it had, so the grid looks unchanged. Now go through the 17 rows and
add second and third categories: `safesangkum` as `{LEADERSHIP, DEVELOP}`, a hackathon
build as `{LEADERSHIP, DESIGN}`, a contribution you also designed as
`{OPEN_SOURCE, DESIGN}`.

Worth doing as a reviewed list, so there is a record of what changed.

### 8. Cut the application over

- `getWorkItems()` becomes two queries (`Work` + `OpenSourceContribution`) instead of
  three plus per-row tag joins, and reads `categories` directly.
- The card's `pitch` becomes `cardBlurb ?? tldr`, replacing today's
  `excerpt ?? description`. `.work-card-pitch` already clamps to 2 lines and reserves
  that height, so no CSS changes.
- `projectCategories()` and `PROJECT_TYPE_TO_CATEGORY` are deleted: the column already
  holds `WorkCategory` values, so no mapping layer survives.
- `getProjectTags`/`getAchievementTags` and all junction queries are deleted; skills come
  back on the row.
- OSS keeps its grouping, counts, and PR list unchanged. It gains a skills row on the
  detail page (unioned across the group) and renders `githubUrl` in teal with `links` in
  amber, same as Work.
- Link rendering becomes one shared component used by both tables: the repo link in
  `--accent-primary`, each `links[]` entry in `--signal`.
- Drop `legacy_project_id`, `Project`, `Achievement`, and `ProjectType` only after this
  has run in production long enough to trust.

## URLs

`/projects/[slug]` and `/achievements/[slug]` both become `/work/[slug]`, 301 from the
old prefixes. A row that is both leadership and design has no business living under one
of those two prefixes, and routing by "primary" category would mean the canonical URL
changes whenever categories are reordered, breaking existing links.

`/open-source/[slug]` stays as-is, since that table stays.

Verified: no slug collisions across the 17 merged rows, so slugs carry over unchanged.
`/r/[slug]`, `sitemap.xml`, and `generateStaticParams` need updating in the same pass.

## Risks

- **Dropping `liveUrl` moves data into `links` JSON.** Reversible, but verify the
  generated entries before dropping the column.
- **String skills have no integrity.** A typo is a new grey skill, not an error. Step 6's
  validation is the safety net; keep it in CI.
- **`Project.url` is non-null today.** Confirm nothing reads it before dropping.
- **`AchievementTag` being empty is worth a look** independently: `getAchievementTags`
  exists and returns nothing for all 9 rows, which may be a bug that predates this work.

## Open question

`BlogPost` stays out of the work grid. It keeps its own `tags` String[] and only loses
the unused `BlogPostTag` junction.
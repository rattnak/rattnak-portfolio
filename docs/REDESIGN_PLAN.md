# rattnak.com Redesign: Implementation Plan

Self-contained specification for redesigning this portfolio. Written to be executed phase by phase by an AI coding assistant or a human. Read this whole file plus `CLAUDE.md` before writing code.

## 0. Context and hard rules

**Who:** Chanrattnak Mong (she/her), Full-Stack Software Engineer. 2+ years of backend development in Python and Node.js (REST APIs, AWS, Docker) plus React/Next.js, across fintech, education, and cybersecurity. Interests: automation, system integrations, agentic AI.

**Brand thesis (use verbatim as the hero headline):** "I like making complicated things simpler."
**Values line:** "Humans come first. Technology should make their work better."

**Design concept, named "Instrumented":** a calm editorial surface with precise engineering instruments. Monospace numerals, hairline ledger rules, live data, diffs and diagrams as design objects. Roughly 90% machine precision, 10% deliberate human warmth (first-person voice, one hand-drawn gesture, her face and story in About). Audience priority: recruiter speed first, engineering depth second, craft third, spectacle never.

**Hard rules (violating any of these fails review):**
1. NEVER use em dashes (U+2014) in any site content, component strings, alt text, metadata, or database copy. Use a comma, colon, period, or parentheses. Grep for the character before every commit.
2. Use she/her in any third-person copy (metadata, JSON-LD, bios, alt text).
3. Never render her email address as plain text or static `mailto:` in server HTML. Use the existing `POST /api/reveal-email` pattern.
4. Git commits: plain messages, no Co-Authored-By trailers, no AI attribution of any kind.
5. No auth wall in front of the resume or any core content.
6. Accessibility is not optional: WCAG AA contrast, keyboard operability, visible focus, `prefers-reduced-motion` alternatives that are designed states (never blank space).
7. Prefer server components; add `"use client"` only where interaction requires it. Prefer CSS transitions over JS animation libraries.
8. Do not install heavy libraries without strong justification. framer-motion is being phased out, not extended. No three.js.

**Stack facts:** Next.js 15 App Router, React 19, TypeScript, Tailwind v4 + design tokens in `styles/globals.css`, Supabase (content, via `lib/database.ts` and supabase-js), Prisma as migration tool only. Supabase RLS denies anonymous writes; content changes need SQL run by Chanrattnak in the Supabase dashboard. ISR everywhere (`revalidate`).

---

## Phase 1: Foundations (partially complete)

Already done (commits on main, 2026-08-13): removed unused deps (three, react-three, @prisma/client) and no-op middleware; real README; CLAUDE.md; Inter font variable actually applied to body; WCAG contrast fixes for text-secondary/text-muted; mobile card line-height fix; OpenGraph/Twitter metadata, title template, JSON-LD Person, sitemap.ts, robots.ts; footer mailto removed; `POST /api/reveal-email` added; em dash removed from Slideshow alt text.

### 1.1 Remaining: database content fixes (Chanrattnak runs in Supabase SQL editor)

```sql
UPDATE "Achievement" SET name = 'Cambodian Seed Delegate, COP28 UAE' WHERE id = 7;
UPDATE "Achievement" SET name = 'HANDONG UNESCO UNITWIN, Top 3 Participant' WHERE id = 8;
UPDATE "Achievement" SET name = 'Cambodian Seed Delegate, Huawei Seeds for the Future 2023' WHERE id = 9;
UPDATE "Achievement" SET name = 'Student Representative Speaker, DICHI Academy Launch' WHERE id = 11;
UPDATE "OpenSourceContribution" SET description = replace(description, ' — ', ': ') WHERE id = 15;
```

### 1.2 Remaining: resume tracking (no auth, full visibility)

Add to `prisma/schema.prisma`, generate a migration, and have Chanrattnak apply it:

```prisma
model ResumeLink {
  id        Int            @id @default(autoincrement())
  slug      String         @unique   // "linkedin", "github", "stripe-2026"
  label     String                    // "LinkedIn profile", "Stripe application Aug 2026"
  kind      ResumeLinkKind @default(CHANNEL)
  active    Boolean        @default(true)
  createdAt DateTime       @default(now())
  accesses  ResumeAccess[]
}

model ResumeAccess {
  id         Int         @id @default(autoincrement())
  linkId     Int?
  link       ResumeLink? @relation(fields: [linkId], references: [id])
  src        String?     // raw ?src= value when no ResumeLink matches
  referrer   String?
  country    String?
  city       String?
  userAgent  String?
  ipHash     String?     // sha256(ip + RESUME_SALT), never the raw IP
  emailedTo  String?
  accessedAt DateTime    @default(now())

  @@index([linkId, accessedAt])
}

enum ResumeLinkKind {
  CHANNEL
  APPLICATION
}
```

RLS: enable on both tables, no anonymous policies (deny-all). Server routes use `SUPABASE_SERVICE_ROLE_KEY` (add to `.env`, never expose with NEXT_PUBLIC prefix).

Routes:
- `GET /api/resume?src=<tag>`: look up ResumeLink by slug (fall back to storing raw src), insert ResumeAccess (country/city from Vercel geo headers `x-vercel-ip-country` etc., ipHash as salted sha256, skip insert when user-agent matches common bot patterns), fire a notification (see below), then stream `public/resume/chanrattnak-mong-resume.pdf` with `Content-Disposition: inline`. If the PDF is missing, return a friendly 503 JSON.
- `GET /r/[slug]`: same logging, then redirect to `/api/resume` internals (or share the handler). Used for per-application links.
- Notification: if `NOTIFY_WEBHOOK_URL` env is set, `fetch` POST it with `{slug, country, city, repeat_visit}`; works with a Telegram bot URL or any webhook. Fail silently.
- The resume PDF must not contain her bare Gmail; use the domain email or LinkedIn.

Acceptance: downloading via `/r/test-slug` inserts one row with hashed IP and fires the webhook; a curl with `User-Agent: Googlebot` inserts nothing.

### 1.3 Remaining: contact form hardening

In `components/ContactForm.tsx` and `app/api/contact/route.ts`: add a honeypot field (visually hidden input named like `website`, reject when filled), server-side rate limit (in-memory Map by ipHash, 5/hour is fine), explicit `<label>`s, `aria-describedby` for errors, `aria-live="polite"` status region on submit.

---

## Phase 2: Identity (design system, hero, About)

### 2.1 Design tokens: replace the palette in `styles/globals.css`

Light theme (`:root`):
```
--background: #fbfaf8;      /* warm paper */
--background-secondary: #f2f0ec;
--background-tertiary: #e9e6e0;
--text-primary: #16181c;
--text-secondary: #54575e;  /* 7.0:1 */
--text-muted: #6d7078;      /* >=4.5:1, small-text safe */
--accent-primary: #0f7b6c;  /* deep teal, "settled ledger" */
--accent-primary-hover: #0c6458;
--accent-glow: rgba(15, 123, 108, 0.10);
--signal: #b45309;          /* amber, rare */
--border: #dedbd4;
--border-secondary: #cfccc4;
```
Dark theme (`.dark`):
```
--background: #0a0c0e;      /* blue-black */
--background-secondary: #111417;
--background-tertiary: #191d21;
--text-primary: #f2f3f4;
--text-secondary: #9aa0a6;
--text-muted: #7c828a;
--accent-primary: #3ddbb7;  /* phosphor teal */
--accent-primary-hover: #63e4c8;
--accent-glow: rgba(61, 219, 183, 0.10);
--signal: #f5a524;
--border: #23282d;
--border-secondary: #2e343a;
```
Delete `--accent-secondary` (purple) and the pink/cyan conic gradients tied to the old orbit design. Keep shadow and transition tokens. Check every usage of removed tokens.

### 2.2 Typography

- Load **Switzer** (variable, from Fontshare; self-host the woff2 in `public/fonts/`, declare via `next/font/local`) as `--font-sans`, weights 400/600/700. Replace Inter.
- Load **JetBrains Mono** (or Commit Mono) as `--font-mono`, weights 400/600.
- Body: 17px/1.65. Display: clamp(2.5rem, 6vw, 4.5rem), weight 700, letter-spacing -0.02em, `text-wrap: balance` on headings.
- New utility class `.instrument`: font-mono, `font-variant-numeric: tabular-nums`, used for ALL dates, metrics, tags, eyebrows, section labels.
- Uppercase mono labels get letter-spacing 0.08em.

### 2.3 Layout language

- Container max-width 1100px (from 1280px).
- New section-header pattern, the "ledger rule": full-width 1px top border with a small mono label (`work`, `open source`, `about`) and the section heading on the same baseline row. Replace existing section headings site-wide. Do NOT number the labels (the sections are not a sequence).
- Cards: flatten. 1px border, 8px radius, no default shadow, background = background; hover: border sharpens to border-secondary + translateY(-2px) via CSS only. Remove framer-motion from ProjectCard, AchievementCard, BlogCard, OpenSourceCard, AchievementListItem, Slideshow; then remove framer-motion from package.json if nothing else imports it.
- Left-align all section content including the hero at every breakpoint.
- Delete the radial glow blob in Hero and any decorative gradients.

### 2.4 New hero (`components/Hero.tsx` rewrite)

Remove: orbit atom, orbiting social icons, browser-window portrait, "AI" badge, radial glow. Structure (left-aligned, two-column on desktop, stacked on mobile):

Column A:
1. Mono eyebrow: `Chanrattnak Mong, Full-Stack Software Engineer`
2. H1: `I like making complicated things simpler.`
3. Interactive untangle element (see 2.5) rendered as the headline's underline zone.
4. Proof sentence (text-secondary): `2+ years building backends in Python and Node.js: payment systems with live bank integrations, event-driven services, and agentic AI that removes repetitive work, across fintech, education, and cybersecurity.`
5. Values line, small italic muted: `Humans come first. Technology should make their work better.`
6. CTA row: primary button `View work` (/projects), ghost button `Resume (PDF)` (/api/resume?src=site).
7. Identity line, mono small: `github.com/rattnak · linkedin.com/in/mongchanrattnak · email ⧉` where the email item is a button calling `/api/reveal-email` then copying to clipboard (announce "Email copied" via aria-live).

Column B: the live status panel (see 2.6).

### 2.5 Interactive untangle-the-knot (signature element)

A client component (`components/UntangleKnot.tsx`), inline SVG, no libraries:
- A path that starts as a tangle: 4 draggable control knots (circles, 44px hit area, visible at ~12px) displace a catmull-rom/bezier path from a straight line.
- Visitors drag knots toward the baseline; within a snap threshold each knot locks (small tick, knot turns accent color). When all 4 lock, the path animates to a straight accent-colored line underlining the H1, and a mono stamp fades in: `simplified ✓ 4.2s` (their elapsed time).
- Log completions: `POST /api/untangle` inserts `{durationMs}` into an `UntangleSolve` table (same migration batch as 1.2; RLS deny-read for anon is fine, insert via service role with rate limiting). Display aggregate below the stamp: `untangled by 1,204 visitors` (fetch count server-side, ISR).
- Keyboard: knots are focusable (`role="slider"`, aria-valuetext), arrow keys nudge, Enter snaps when close.
- Touch: knots respond to pointer events; the SVG must not block page scroll (touch-action manipulation on knots only).
- Auto-solve gently after 8s idle (animate to solved over 1.2s). `prefers-reduced-motion`: render solved state immediately with a subtle `replay` text button.
- Acceptance: playable by mouse, touch, and keyboard; Lighthouse a11y unaffected; zero layout shift (SVG has fixed viewBox height).

### 2.6 Live status panel (`components/StatusPanel.tsx`)

Instrument-styled card, mono face, rows as a table:
- `region`: from Vercel header (server component reads `headers()`).
- `this page rendered in`: measure server render duration (Date.now delta in the RSC) or use `performance` timing client-side; label honestly.
- `cache`: HIT/MISS + age (derive from a build/revalidate timestamp module-level constant).
- `visitors now`: Supabase Realtime presence channel; client island subscribes and shows count; falls back to `·` when disconnected.
- `deploy`: short commit hash + relative time from `NEXT_PUBLIC_COMMIT_SHA`/`NEXT_PUBLIC_BUILD_TIME` env (set in next.config via `process.env.VERCEL_GIT_COMMIT_SHA`).
- Header row: `site telemetry` + a pulsing accent dot (CSS animation, none under reduced-motion).
- First-visit "boot" animation: rows cascade in over ~1.2s (CSS only, stagger via animation-delay; reduced-motion: all visible immediately).

### 2.7 About page (`app/about/page.tsx`, add to nav)

1. Ledger-rule header `about`.
2. Photo (the current `public/img/Chanrattnak_Mong.jpg`, next/image, modest size, 8px radius).
3. Bio: her self-description, lightly trimmed, first person, NO em dashes:
   - Heading: `I like making complicated things simpler.`
   - Body: repetitive/fragmented processes, full-stack + APIs + integrations + automation + agentic AI, "not every problem needs an AI solution", accessibility and open source, values line bold at the end.
4. Experience as a ledger table (dates in mono left column like a debit column, role + 2-3 metric bullets center, headline outcome right-aligned in mono accent). CONTENT REQUIRED FROM CHANRATTNAK: real roles, dates, outcomes. Until provided, build the component with clearly-marked placeholder data behind a `const EXPERIENCE: Entry[] = []` that hides the section when empty.
5. Education + skills as compact mono tag rows.
6. Close with the connect panel (2.8).

### 2.8 Connect panel (`components/ConnectPanel.tsx`)

SUPERSEDED by 2.11 (2026-08-11): the connect panel merges into the global footer; ConnectPanel is deleted. Kept for history only.

Pre-footer section on home + contact + about pages:
- Title: `Let's build something simpler.`
- Status line, mono: `● open to software engineering roles · GMT+7 · replies within a day` (accent dot).
- Instrument table rows: `email` (click to reveal then copy), `linkedin` (in/mongchanrattnak ↗), `github` (@rattnak ↗), `resume` (one-click PDF ↓, uses /api/resume?src=site).

### 2.9 Footer

SUPERSEDED by 2.11 (2026-08-11): the footer is rebuilt as a two-tier component; the name block and icon-only social row described here are removed. The provenance line and sign-off survive into 2.11. Kept for history only.

Extract Footer from `app/layout.tsx` into `components/Footer.tsx`. Add provenance line, mono: `commit <sha7> · built <date> · Next.js 15` linking sha to the GitHub commit, plus `colophon ↗` link (page comes in Phase 4; link to /colophon only once it exists). Keep social icons. One human sign-off line in italic: short, warm, hers.

### 2.10 Card outcome metrics

Add optional `outcome` display: for projects use `excerpt`-adjacent new column (`outcome` TEXT, migration + Supabase update by Chanrattnak), rendered as a mono line on the card: e.g. `2 days → 20 min` style deltas. Achievements already have `result`; render it in mono. Rename card meta labels: `CODING` renders as `Engineering`, `CASE_STUDY` renders as `Case study`.

### 2.11 Footer consolidation (final, 2026-08-11; supersedes 2.8 and 2.9)

Decision record: ConnectPanel and Footer duplicated GitHub, LinkedIn, and contact, and stacked as two bordered end-sections on home, about, and contact. Approved design (mockups: https://claude.ai/code/artifact/1453b3e3-7bfd-41d0-9737-c2456b14c61b): one global two-tier footer on every page, labeled icon buttons for findability, and the email reveal relocated beside the contact form (variant 3a in the mockups).

**Rebuild `components/Footer.tsx` (stays a server component; SimplifyToggle is its only client child):**

Tier 1, connect (border-top, `.section` padding, inner content max-width 42rem):
1. Heading: `Let's build something simpler.` (h2 sizing; the footer repeats across pages, so use a heading level that does not fight page structure).
2. Status line, mono, with the pulsing accent dot: `open to software engineering roles · GMT+7 · replies within a day`. Dot animation off under `prefers-reduced-motion` and `data-simplified` (the existing global kill-switch already covers the latter).
3. Social row, BUILT icon-only (revised 2026-08-11 from the labeled buttons in the mockup): three square 2.75rem bordered targets reading as one compact instrument cluster, 1px `--border-secondary`, radius 0.5rem, hover border and icon to `--accent-primary`, `:focus-visible` outline, wrap on mobile. The accessible name lives in `aria-label` + `title`, not visible text. The stroke envelope glyph is set at 1.4rem against the fill glyphs' 1.125rem so the three read at equal optical weight:
   - `GitHub` -> https://github.com/rattnak (target _blank, rel noopener noreferrer)
   - `LinkedIn` -> https://linkedin.com/in/mongchanrattnak (target _blank, rel noopener noreferrer)
   - `Email` -> internal Link to the contact section (no client JS; the reveal lives there, see below)

   No resume button in the footer (decided 2026-08-11): the resume is offered in the hero and the command palette, and repeating it here made the row compete with itself. `/api/resume?src=footer` is therefore not a tracked source.
4. Sign-off, italic, unchanged copy: `Thanks for stopping by. If something here is broken, I'd genuinely like to know.`

Tier 2, baseline (BUILT as two stacked rows, revised from the single flex row; border-top, ~1.25rem vertical padding):
- Top row, space-between: the `Chanrattnak Mong` wordmark on the left anchoring the block, and a controls group on the right holding `Colophon ↗` and SimplifyToggle as real buttons rather than words buried in the fine print.
- Bottom row, mono `--text-xs` muted: `© <year> Chanrattnak Mong · commit <sha7> · built <date> · Next.js 15` (sha links to the GitHub commit, keep the existing env fallback chain). "All rights reserved" and the role line are dropped.

**Relocate the email reveal (`components/RevealEmail.tsx`, client):**
- Extract the reveal logic from ConnectPanel: idle/loading/revealed/copied/error states, fetch `POST /api/reveal-email` once and cache, hide (eye) toggle, `aria-live="polite"` announcements. Do not touch the API route.
- BUILT differences from the original extraction: the revealed address renders as plain text, never a `mailto:` link, because an href would put the address back into rendered HTML for scrapers even after a deliberate click. Copying is therefore an explicit copy button (clipboard icon, swapping to a check on success) rather than an automatic copy-on-reveal. A `showPrompt` prop toggles the `prefer email directly?` lead-in so the navbar's compact email popover can reuse this same component instead of reimplementing it.
- Rendered in the About page's `get in touch` section under the form (`app/about/page.tsx`) as a bordered-top row, and reused in the navbar popover.

**Deletions and wiring:**
- Remove `<ConnectPanel />` from every page and delete `components/ConnectPanel.tsx` after the extraction. (DONE. The standalone `/contact` route was separately merged into `/about#contact` with a 301, so the footer's Email button targets `/about#contact` directly, no redirect hop.)
- Migrate the `.connect-panel-*` CSS in `styles/globals.css` to footer/reveal class names; grep for orphaned classes and dead references when done.
- `components/CommandPalette.tsx` calls `/api/reveal-email` directly (its copy-email action); it is independent of ConnectPanel and must keep working unchanged.

**Acceptance (in addition to the standing checklist):**
1. Exactly one footer, identical on every route including blog/[slug] and project/open-source detail pages; no page ends with two bordered sections.
2. `components/Footer.tsx` has no `"use client"`; only SimplifyToggle and RevealEmail are client components.
3. On /about#contact and in the navbar popover: reveal click shows the address and announces via aria-live; the copy button copies and confirms; hide works; error state recovers; address absent from server HTML (`grep -o "@gmail" .next/server/app/about.html | wc -l` = 0).
4. Keyboard walk of the footer: every button reachable with visible focus; labels read correctly to screen readers.
5. Both themes, `data-simplified`, and reduced-motion all checked; no em dashes introduced (grep before commit).

Phase 2 acceptance: no framer-motion imports remain; hero interactive and accessible; About exists with real or hidden-placeholder experience; all pages use the new tokens; light and dark both AA; `npm run build` clean.

### 2.12 Footer, work filter, and navbar revision (2026-08-11; revises 2.11)

Decision record: the 2.11 build was correct in structure but overweight in practice. The footer stacked six competing blocks (heading, status, boxed icon cluster, sign-off, wordmark row, control pills, provenance), and the two control pills gave optional site controls the visual weight of primary actions while the wordmark, the thing that should anchor the block, was smaller than the connect heading above it. The navbar separately duplicated the social links and carried a `Contact` entry pointing at a section of a page already in the list.

**Footer (`components/Footer.tsx`, still a server component):**
- One signature band, not two tiers of content. Left: `Chanrattnak Mong` wordmark, then the brand thesis `I like making complicated things simpler.` as a quote with an accent left rule, then the existing mono status line with its pulsing dot. Right: the three social links as borderless 2.25rem glyphs on a hairline left rail (`.footer-social`), hover lifts them 2px to the accent. The rail becomes a top rule below 640px when the band stacks.
- The `Let's build something simpler.` heading is REMOVED from the footer and moved to About's get-in-touch section (below). It is a call to action; repeating it on every page next to no form diluted it.
- The sign-off line moves with it, under the contact form.
- Baseline row: provenance mono line on the left, controls on the right (was: wordmark left, controls right, provenance below).
- Colophon and SimplifyToggle are instrument links, not pills and not bare underlined text: lowercase mono, a leading glyph (`{ }` for colophon, `≡`/`■` for simplify) that marks them as controls, and a dotted bottom rule that turns solid accent on hover. Colophon's label is now `how this site is built`, which says what it is. `SimplifyToggle` renders the glyph itself, so its base `.simplify-toggle` rule dropped the forced underline and became inline-flex.

**Get in touch (`app/about/page.tsx`):**
- Section heading is now `Let's build something simpler.` (`.contact-title`).
- `RevealEmail` moves ABOVE the form and back into a bordered box on `--background-secondary` (`.reveal-email`), the prominent instrument-row treatment it had in the footer. Under the submit button it read as an afterthought. The prompt takes `margin-right: auto` so the control sits at the row's right edge.
- The navbar popover override zeroes the box, since the popover is already a bordered surface.

**Work filter (`components/WorkGridClient.tsx`):**
- The underlined tab row becomes a mono chip rail (`.work-filter`). Each chip carries the category's own accent (`--cat-develop`/`--cat-design`/`--cat-oss`/`--cat-leadership` via a `--chip-accent` variable set by `[data-category]`), a dot that is hollow when idle and filled when active, and a live item count. Active state is a tinted surface in the category's colour rather than a shared accent underline: with five categories, colour is what identifies the slice.
- Labels are lowercase to match the instrument system. The rail wraps instead of side-scrolling, because a count scrolled off-screen is a hidden fact.
- The ledger rule above it gains a right-side readout (`.ledger-rule-readout`) showing the visible item count.
- Chips still hide when a category is empty; the count check now doubles as that test.

**Navbar (`components/NavbarClient.tsx`):**
- `Contact` removed from `NAV_LINKS`: About absorbed `/contact`, and the envelope icon is the contact affordance.
- GitHub and LinkedIn icons removed. The navbar navigates this site; those links live in the footer and the command palette. `ContactIcons` is therefore renamed `EmailPopoverButton` and holds only the envelope trigger and its popover.

Acceptance: `npm run build` clean, `tsc --noEmit` clean, no orphaned `.connect-icon`/`.footer-connect`/`.filter-tab` references, `grep -o "@gmail" .next/server/app/about.html | wc -l` = 0 and no `mailto:` in any prerendered HTML, no em dashes.

### 2.13 Reveal-email copy button removed; slug URLs for projects and achievements (2026-08-11)

**Reveal email (`components/RevealEmail.tsx`):**
- The copy button is removed. Revealing already copies to the clipboard, so the button was a second path to something that had just happened; the address stays selectable as the manual fallback.
- Copy-on-reveal is now the only clipboard path, so its failure is announced (`"Email revealed, select the address to copy it"`) instead of being swallowed. It can fail on permissions, an insecure context, or browser restrictions.
- The `"copied"` status value is gone: nothing rendered it once the button was removed. Announcements carry that information now.
- Unchanged: plain text, never a `mailto:` href.

**Slug URLs (supersedes the numeric-id routes):**

Decision record: `/projects/5` and `/achievements/4` exposed database ids in URLs that are shared and indexed. Both now address by slug, matching `BlogPost` and `/open-source/[slug]`.

- Schema: `slug String @unique` on `Project` and `Achievement`, plus `idx_project_slug` / `idx_achievement_slug`. Migration `20260811_add_project_achievement_slugs` adds the column nullable, backfills, then applies NOT NULL and the unique index. That order matters: the constraint cannot be added before the rows have values.
- The backfill slugifies `name` the same way `projectNameToSlug()` does, with a `row_number()` suffix as the collision guard (oldest id keeps the clean slug, later ones get `-2`, `-3`) and an id-based fallback for names with no alphanumerics. Applied result: 8 projects, 8 achievements, 0 duplicates, 0 empty.
- Routes renamed `app/projects/[id]` -> `[slug]` and `app/achievements/[id]` -> `[slug]`. Data access via new `getProjectBySlug` / `getAchievementBySlug` (both `maybeSingle`, so an unknown slug is an ordinary 404 rather than a logged error on every crawler probe).
- Legacy ids still resolve: a digits-only segment is looked up by id and `permanentRedirect`s to the canonical slug URL (308 in dev, 301 semantics). Real slugs always contain a letter, so the check is unambiguous. Verified: `/projects/5` -> `/projects/ibtss-26-ai-learning-passport`, `/achievements/4` -> `/achievements/harvard-wecode-2026-distinguished-tech-fellow`, unknown slugs and unknown ids both 404.
- Updated consumers: `lib/database.ts` work-item hrefs, `app/sitemap.ts`, `app/api/search-index/route.ts`, `app/api/revalidate/route.ts` (now keyed on `record.slug`, not `record.id`), `app/colophon/page.tsx` route table.

**Schema drift found while doing this (NOT fixed, needs a decision):**

`prisma migrate status` reports five unapplied migrations, and the live database is missing columns the running code already reads:
- `Project.outcome` is declared in `schema.prisma` and read by `getWorkItems`, but no migration creates it and it does not exist in the database.
- `Achievement.links` does not exist, though `getAchievementLinks()` reads it; migration `20260811_add_achievement_links` was never applied.
- `20260810_add_achievement_image_urls` cannot be applied as written: it references `Achievement.imageUrl`, a column this database does not have, so `prisma migrate deploy` would fail partway through the batch.

Because of that last point the slug migration was applied on its own via `prisma db execute` rather than `migrate deploy`. The drift is pre-existing and currently silent (supabase-js returns missing columns as `undefined`, which the `??` fallbacks absorb), so cards render without outcomes and achievements without extra links rather than crashing. Resolving it means reconciling `_prisma_migrations` with reality, which is a separate piece of work.

### 2.14 Navbar contact removal, reveal placement, footer polish, provenance, sticky filter, achievement detail parity (2026-08-12)

**Navbar (`components/NavbarClient.tsx`):** the email popover is removed, so the navbar now carries no contact affordance at all (GitHub and LinkedIn went in 2.12). It navigates this site; contact lives in the footer, the command palette's copy-email action, and the form. Cascading deletions: `RevealEmail`'s `showPrompt` prop (its only consumer was the popover) and the `.navbar-email-popover` rules.

**Reveal email placement (`app/about/page.tsx`):** moved from a full-width band above the two-column grid into the left column under `ContactForm`. The band split the section in two and pushed the form down. The form is the primary channel and the address is the fallback, so it now follows the submit button in reading order. Restyled to match that demotion: the tinted `--background-secondary` box is gone, replaced by a top hairline and a full-width `flex-basis: 100%` label above the control (side-by-side does not fit the narrower column).

**Footer visual fixes (beyond the 2.13 plan):**
- Thesis quote removed; the name now appears once (it was in both the wordmark and the copyright).
- The social row's `border-left` is deleted. On a flex item with `align-items: flex-start` it only spanned the icons' own height, reading as a stray mark rather than a column rule. With the left column down to a name and a status line, whitespace separates the groups on its own.
- `align-items: center` and 2.5rem (was 3.5rem) block padding: the shorter left column no longer justifies the height, and centering puts the icons on the block's optical midline.

**Commit provenance (`next.config.ts`):** `resolveCommitSha()` prefers `VERCEL_GIT_COMMIT_SHA`, else `git rev-parse HEAD`. The try/catch is load-bearing: a tarball build has no `.git` and may have no `git` binary, and returning undefined there preserves the previous skip-the-fragment behavior instead of failing the build. Fixes the colophon at the same time, which reads the same variable. Verified: the footer renders `commit 41a981f` in a local production build.

**Sticky work filter (`components/WorkGridClient.tsx`):** the rail and grid share a `.work-sticky-scope` wrapper so `position: sticky` on `.work-filter-bar` releases at the end of the grid. `top: var(--navbar-height)` reuses the header's own token so the two cannot drift. Added `--container-gutter` to `.container` (1rem / 1.5rem / 2rem across breakpoints) so the bar can full-bleed its blurred background without a seam while the chips stay on the container grid. Below 640px the rail becomes one scrollable row rather than wrapping to two lines. `data-simplified` unpins it entirely.

**Achievement detail parity (`components/AchievementDetailClient.tsx`):** the achievement page was the odd one out, a plain 48rem single column with a loose back link and no sticky header, while Project and Open Source shared a condensing sticky shell. (The OSS comment claiming "same pattern as Projects and Achievements" was aspirational; Achievement never had it.) It now uses the same shell: `.project-detail-sticky` with the IntersectionObserver sentinel and `-64px` rootMargin, back link inside the header, meta line that hides when condensed, and a `.project-detail-title-row`. Its up-to-3 labeled links become the header's action buttons, first one `btn-primary` and the rest `btn-secondary`, mirroring how the other pages weight Live Website over View on GitHub; they collapse to `btn-icon` when condensed. The description moves into the shared `.project-detail-tldr` callout. Only the body differs, which is correct: achievements render markdown, projects render an HTML overview, open source renders a PR list. Open Source keeps no TL;DR because its lede is a generated sentence, not authored copy.

Verified: `tsc --noEmit` and `npm run build` clean; all three detail pages emit `project-detail-sticky`, `project-detail-title-row`, and `back-link`; footer contains the name exactly once and no thesis; email absent from prerendered HTML (0 `@gmail`, 0 `mailto:`); no orphaned `.footer-thesis`, `.navbar-email-popover`, or `showPrompt` references; no em dashes.

**Still open:** whether the work filter should instead merge into the navbar as a dropdown on scroll (raised 2026-08-12, not built). Tradeoff recorded: one bar instead of two saves vertical space on mobile, but five chips will not fit beside the nav links, so it would collapse to an `all ▾` dropdown, losing the at-a-glance counts and category visibility that the rail provides.

### 2.15 Reveal email as a masked field; resizable message; responsive filter rail (2026-08-12)

**Reveal email (`components/RevealEmail.tsx`, `app/api/reveal-email/route.ts`):**
- Hidden state renders masked dots with an eye toggle beside them, borrowing the password-field convention so the control explains itself. No bordered box: the dots and the eye carry the metaphor, and a filled input under the form's submit button would read as another form control rather than a quiet secondary path. Both states sit inline on one line.
- The dot count is the address's real character count, so the row does not resize when it toggles. `GET /api/reveal-email` returns `{ length }` only and is fetched on mount; `POST` still returns the address and still only on a deliberate click. A character count is not an address: it gives a scraper nothing to contact or verify, and it is already inferable from the value anyone can request. `FALLBACK_MASK_LENGTH = 24` covers the window before that fetch lands and the case where it fails.
- Mask and address share the same mono stack at `--text-ui` with no extra letter-spacing, so their widths match exactly and the eye icon does not shift.
- Clicking the revealed address copies it and floats a "Copied" bubble above it (1.6s, `pointer-events: none` so a second click still lands, no transform under `prefers-reduced-motion`). The address is a `<button>`, never a `mailto:` href.
- Copy-on-reveal is gone: copying is now the explicit click on the address, so the reveal action only reveals.

**Contact form (`components/ContactForm.tsx`):** the message textarea was `resize-none`; it is now `resize: vertical` with `minHeight: 6rem` and `maxHeight: 70vh`. Vertical only, because widening it would break out of the form column; the bounds stop the drag handle collapsing the field to nothing or growing it past the viewport.

**Work filter responsiveness (`styles/globals.css`):** three behaviors instead of one mobile rule.
- `>900px`: wraps normally (all five chips fit on a line, so scrolling would only hide them).
- `641-900px`: one scrollable row at full chip size; the text fits even though five chips do not. Negative `margin-inline` cancelling the bar's padding lets the first and last chip sit flush with the container edge while scrolled.
- `<=640px`: same scrolling row with tighter chip padding, and the per-chip counts hide. The label identifies a category, the number only quantifies it, so the count is what goes first. The ledger rule's `.ledger-rule-readout` keeps the visible-item count on screen at every width, so that information is not lost.
- Scrollbar hidden in all engines that support it (it would sit under the chips and read as a stray rule); the row stays keyboard, wheel, and touch scrollable, and focusing an off-screen chip scrolls it into view.

**Navbar submenu: proposed, built, then reverted (2026-08-12).** A Work submenu listing Development / Design / Open Source / Leadership was implemented (desktop hover-and-focus dropdown, inline indented rows in the mobile drawer, `/#work-<category>` hashes parsed by `WorkGridClient` to preselect a filter) and then removed at Chanrattnak's direction: the navbar carries Work and About (plus Blog) at every device width, and category selection belongs to the work rail alone, which is why the rail became responsive instead. All of it is gone: no `NavItemWithMenu`, `WORK_CHILDREN`, `CATEGORY_KEYS`, hash-sync effect, `.work-anchor` targets, or `.navbar-menu*` rules remain (grepped clean).

Verified: `tsc --noEmit` and `npm run build` clean; `GET /api/reveal-email` returns the true length (25); home page navbar emits only Work and About; address absent from prerendered HTML (0 `@gmail`, 0 `mailto:`); no em dashes.

### 2.16 Featured badge, breadcrumb trail, card responsiveness, navbar drawer removal (BUILT 2026-08-12)

Plan artifact: https://claude.ai/code/artifact/18171f19-c873-4c7c-94b5-6cfca2ad17b6

All six built and verified. Six changes, from two screenshots.

**Diagnostic note that frames everything below:** the screenshots are ~1074-1486px wide yet show the `Menu` control and a single-column grid, both of which only occur below 768px. That is browser zoom, so the effective viewport is far narrower than the image. This is a WCAG 1.4.10 (Reflow) and 1.4.4 (Resize Text) scenario, not a cosmetic one: fixes must be verified at 200% zoom, not by resizing a window.

1. **Featured badge on the work card (`components/WorkCard.tsx`).** `featured` already exists on `WorkItem` and already sorts featured items to the top, but only the detail page renders it, so the grid's ordering carries meaning nothing explains. Add a mono uppercase badge top-left inside `.work-card-cover` (needs `position: relative`), on a translucent blurred surface so it reads over both photo covers and the typographic fallback. Not `aria-hidden`: it is real information. Label stays the single word `Featured` because the whole card is one link and the badge joins its accessible name.

2. **Grid breakpoints and cover cap (`styles/globals.css`).** `.grid-3` is 1 column below 768px, 2 from 768, 3 from 1024, so a ~700px effective viewport gets one card as wide as the page (the screenshot's cover is roughly 1370x910). Lower to 2 columns at 560px and 3 at 1000px, and add a `max-height` to the cover with `object-fit: cover` so it crops rather than distorts and can never dominate. Card type stays on the existing rem scale: smaller cards must not mean smaller text.

3. **Detail header sizing (`styles/globals.css`).** `IBTSS'26 AI Learning ...` truncates while the action buttons sit at full size, because `.project-detail-title-row` is `nowrap` and only the title has `overflow: hidden; text-overflow: ellipsis`. The title is the page identity and the buttons are secondary, so that priority is inverted. Shrink full-size buttons to `--text-sm` with tighter padding and smaller icons at every width, drop the title's `clamp()` floor slightly, and let the title wrap to two lines instead of truncating. The condensed pinned bar keeps its single line and ellipsis, which is correct there.

4. **Breadcrumb trail + history-aware Back (`components/Breadcrumb.tsx`, new).** `Back to work` does two jobs badly: it never says where you are, and it always goes to `/#work` regardless of how you arrived. Split them. Trail is `Work / <Category> / <Title>` in a real `<nav aria-label="Breadcrumb">` with an ordered list; the last segment is `aria-current="page"` and not a link; only the title truncates. Back becomes a chevron calling `router.back()`, which restores the previous scroll position (the "cached page" behavior requested). **Edge case that needs care:** a directly-opened detail page (shared link, search result, new tab) has no in-site history, so Back would do nothing or leave the site. It renders as a link to `/#work` unless `window.history.length > 1` and `document.referrer` is same-origin, checked on mount, defaulting to the safe link when unsure. Applies to all three detail clients.

5. **Navbar drawer removal (`components/NavbarClient.tsx`).** Links collapse into a slide-in drawer below 768px, which is why `Menu` appears in both screenshots. With two or three links there is nothing worth collapsing. Delete the drawer, backdrop, `createPortal`, `open` and `mounted` state, body-scroll lock, Escape handler, and `.navbar-drawer*` CSS; the two `md:hidden` / `hidden md:flex` rows become one inline row at every width. Links tighten spacing rather than disappearing at 320px. Net result is less client JS.

6. **Pinned filter bar faults (`styles/globals.css`).** Both screenshots show `leadership` clipped at the top left and ghosted text bleeding through the bar. Cause: the background is `color-mix(... 88%, transparent)`, i.e. 12% transparent, relying on `backdrop-filter: blur()` to obscure what passes under it, but a blur softens text without hiding it. The navbar gets away with this over a page ground; a mid-page bar has cards sliding directly beneath. Make the background opaque and restore the chip row's vertical padding so no chip is clipped by the bar's edge. **Resolved 2026-08-12: the sticky bar stays**, faults fixed rather than pinning removed.

   **Alignment, decided 2026-08-12: left, not centered.** The bar's surface runs full-bleed edge to edge (existing negative `margin-inline`), but the chips inside stay on the container grid, left-aligned. Reasons, strongest first: (a) the `work` ledger label, card grid, headings, and footer wordmark all share one left margin, and centering the chips alone would make them the sole element breaking that line, reading as an error rather than a decision; (b) chips are conditional (empty categories do not render, counts change), so centering means removing one chip shifts all the others sideways, while left alignment keeps target positions stable for a repeatedly-clicked control; (c) below 900px the rail scrolls horizontally, and a centered scrollable row starts with left padding so it appears pre-scrolled and `all` leaves the predictable start position; (d) in left-to-right reading order, left alignment puts `all`, the default state, where the eye lands first.

**As built, notes worth keeping:**
- The Featured badge sits inside `.work-card-cover`, which gained `position: relative`; the existing `overflow: hidden` clips it to the rounded corner. Cover gained `max-height: 15rem`, which is what actually stops one card filling the screen in the single-column case.
- `.btn` is used site-wide (hero, forms), so the detail-header size reduction is scoped to `.project-detail-actions .btn` rather than shrinking every button on the site.
- The title fix required splitting a shared rule: `.project-detail-title-row > *` previously applied `text-overflow: ellipsis; white-space: nowrap` to both the full and condensed titles. Now the full title gets `white-space: normal` with a 2-line `-webkit-line-clamp`, and only the condensed title keeps the single-line ellipsis.
- `Breadcrumb` starts with `canGoBack = false` so the server render and first client render agree, then flips on mount. Both `window.history.length > 1` and a same-origin `document.referrer` are required; anything else (cold load, external referrer, malformed URL) keeps the plain `/#work` link. The bare chevron carries its name via `aria-label`/`title`, which is why "Back to work" still appears in the HTML as an attribute but never as visible text.
- Removing the drawer let `NavbarClient` drop `useState`, `useEffect`, `createPortal`, and the `Link`-only mobile row; it is still a client component solely because `ThemeToggle` and `CommandPalette` are dynamically imported with `ssr: false`. `.navbar-links` gained a responsive gap (0.875 / 1.25 / 2 / 2.5rem) so four items fit at 320px. 2186 characters of `.navbar-drawer*` and `.navbar-mobile` CSS deleted.
- Filter bar: `backdrop-filter` removed entirely along with the translucency, since nothing shows through an opaque bar and the blur was costing a compositing layer for no visible effect. Separately, the scrolling `.work-filter` needed `padding-block: 0.35rem` with a matching negative `margin-block`, because `overflow-x: auto` clips vertically too and was cutting focus rings and the active chip's tinted edge.

Verified: `tsc --noEmit` and `npm run build` clean; 11 Featured badges render on the home grid; all three detail pages emit exactly one `<nav aria-label="Breadcrumb">`, one `aria-current="page"`, and one back control; trails read `Work / Development / Syncia`, `Work / Leadership / Founder, SafeSangkum`, `Work / Open Source / OWASP Nest`; zero visible "Back to work" text; zero `Menu`, `mobile-drawer`, or `navbar-drawer` in rendered HTML; no orphaned `.navbar-drawer*` or `.navbar-mobile` rules; all routes 200 and `/projects/5` still 308s to its slug; email absent from `/about` (0 `@gmail`, 0 `mailto:`); no em dashes.

**Follow-up, same day: breadcrumb category segments are links into the filter.** As first built the middle crumb was plain text. Now both leading segments are real links, underlined at rest (not hover-only, since touch devices have no hover) with a muted rule that turns accent on hover.

- `WORK_CATEGORY_META` in `lib/database.ts` is the single source for each category's label and deep-link href, shaped as a `Crumb` so a breadcrumb spreads it directly. The filter rail and the trail cannot drift apart.
- `WorkGridClient` regained the hash sync removed when the navbar submenu was dropped: `/#work-develop` and friends select that chip. It listens on `hashchange`, not just mount, because following a breadcrumb to the page you are already on changes the hash without remounting.
- Zero-height `.work-anchor` targets give those hashes somewhere to scroll to, with `scroll-margin-top: calc(var(--navbar-height) + 4.5rem)` clearing both the navbar and the pinned filter bar.

Verified: each detail page's trail emits exactly two links with the right hrefs (`/#work` plus `/#work-develop`, `/#work-leadership`, `/#work-opensource` respectively) and one `aria-current` title; all four anchor ids render on the home page; the hash-sync code ships in the home bundle.

Not yet checked by me, needs a browser: the 200% zoom pass, both themes, `data-simplified`, reduced motion, and a keyboard walk of the breadcrumb. The `router.back()` scroll restoration and the live filter-on-arrival behavior can only be confirmed interactively.

---

## Phase 3: Depth (case studies, open source)

### 3.1 Case-study template for flagship projects

Extend project detail pages when `overview` follows the case-study format. Add DB columns (single migration): `role TEXT`, `teamSize TEXT`, `status TEXT`, `outcomeMetrics JSONB` (array of `{label, value}`). Template sections in order:
1. Header: name, one-line value statement, mono meta row (role · team · timeline · status), links.
2. Outcome strip: 3-4 large mono numbers from `outcomeMetrics`.
3. Problem and constraints (2 short paragraphs from markdown).
4. Interactive architecture diagram (3.2).
5. Decisions and tradeoffs: markdown section rendered as cards: Decision / Alternatives / Why / Cost.
6. Hard-problem deep dive with ONE code excerpt or diff block.
7. Results and lessons, honest, first person.

### 3.2 Interactive architecture diagram

`components/ArchDiagram.tsx`: renders from a JSON spec stored in the project's `overview` frontmatter or a new `architecture JSONB` column: `{nodes: [{id, label, sublabel, x, y}], edges: [{from, to, label?}], notes: {nodeId: string}}`. Inline SVG, nodes as rounded rects in site tokens, edges as 1px lines with arrowheads. Hover/focus a node: connected edges highlight in accent, note appears in a side panel (not a tooltip; keyboard accessible, `aria-describedby`). Custom react-markdown fence ` ```architecture ` parses JSON, mirroring the existing ` ```slideshow ` pattern in `getFirstImageFromContent`/Slideshow.
Diff blocks: fence ` ```diff ` styled with add/del colors from tokens.

### 3.3 Open source upgrade

- Group pages: add stars/context line per repo (server-fetched from GitHub API at build with `revalidate: 86400`, no client JS; cache in module scope; handle rate-limit failures by omitting).
- Each contribution: what changed, why it was hard (needs content from Chanrattnak for the top 2-3).
- GitHub activity strip on the Open Source section: latest 5 public events (PRs/pushes) server-fetched, mono list, cached daily.

### 3.4 Homepage assembly

Order: Hero → Projects (featured) → Open Source → Achievements → Blog (conditional). The global two-tier footer (2.11) closes every page; no page-level connect section. Ledger-rule headers throughout. Achievements list items lead with mono result.

---

## Phase 4: Craft

### 4.1 Command palette (hand-built, no cmdk)

`components/CommandPalette.tsx`: opened by ⌘K / Ctrl+K / a subtle navbar button. Native `<dialog>`, focus trap, fuzzy filter (simple subsequence match), roving `aria-activedescendant`. Actions: navigate to every page and project, toggle theme, copy email (via reveal endpoint), open GitHub/LinkedIn, download resume. Data source: one exported array shared with the navbar. Close on Escape/backdrop. Zero dependencies.

### 4.2 View Transitions

Enable the View Transitions API for route changes (Next.js `viewTransition` experimental flag or manual `document.startViewTransition` wrapper in a client layout shell). Card image → detail image morph on project pages via `view-transition-name`. Feature-detect; no polyfill.

### 4.3 Colophon (`app/colophon/page.tsx`)

How the site works: stack, per-route rendering strategy table (static/ISR + revalidate values), font and palette rationale (short), performance numbers (manually updated or from a build script), link to the repo. Wire the footer `colophon ↗` link.

### 4.4 "Simplify this site" control

Footer + command palette action. Sets `data-simplified` on `<html>` (persist in localStorage): CSS kills all animation, hides decorative SVG/status panel (render their static data as plain text), maximizes contrast (swap tokens to pure ink/paper), linearizes cards to single column. This is the accessibility-values-as-feature move; treat its design with the same care as the default theme.

### 4.5 Engineering notes (blog seeds)

Two posts spun out of case studies once Phase 3 content exists. Titles like "Handling webhook ordering from bank APIs" and "When not to use an LLM". The blog nav auto-appears via existing `hasPublishedBlogPosts`.

### 4.6 Optional, only if time allows

- Changelog page from curated git history (`/changelog`).
- Console easter egg: one short `console.log` greeting devtools users, linking the colophon. No ASCII art walls.
- "Ask NAK" AI assistant (palette Q&A over site content via Claude API): SPEC SEPARATELY before building; requires rate limiting, spend cap, and an offline fallback. Do not start it before Phases 2-3 are shipped.

---

## Verification checklist (run every phase)

1. `npm run build` passes; no TypeScript errors.
2. `grep -rn "—" app components lib styles README.md` returns nothing.
3. No `mongchanrattnak@gmail.com` in server-rendered HTML (`curl localhost:3000 | grep -c "@gmail"` = 0).
4. Keyboard-only walkthrough: every interactive element reachable, visible focus, dialogs trap focus.
5. `prefers-reduced-motion`: emulate in devtools; every animated element shows a designed static state.
6. Lighthouse on / and one project detail: Performance ≥ 95, A11y = 100, SEO = 100.
7. Both themes checked on every changed page (toggle + system setting).
8. Mobile 375px width: no horizontal scroll, touch targets ≥ 44px.

## Content Chanrattnak must supply (blocking markers)

- [ ] Resume PDF (without bare Gmail) → `public/resume/chanrattnak-mong-resume.pdf`
- [ ] Experience entries: roles, companies, dates, 2-3 outcome bullets each
- [ ] Outcome metrics per flagship project (the "X → Y" deltas)
- [ ] Architecture JSON + decisions/tradeoffs content for 2-3 flagship case studies
- [ ] "Why it was hard" notes for top open-source contributions
- [ ] Run the Phase 1 SQL fixes and future migrations in Supabase
- [ ] Domain email decision (hello@rattnak.com via Cloudflare Email Routing) for the resume PDF and connect panel

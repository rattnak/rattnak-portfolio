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

Pre-footer section on home + contact + about pages:
- Title: `Let's build something simpler.`
- Status line, mono: `● open to software engineering roles · GMT+7 · replies within a day` (accent dot).
- Instrument table rows: `email` (click to reveal then copy), `linkedin` (in/mongchanrattnak ↗), `github` (@rattnak ↗), `resume` (one-click PDF ↓, uses /api/resume?src=site).

### 2.9 Footer

Extract Footer from `app/layout.tsx` into `components/Footer.tsx`. Add provenance line, mono: `commit <sha7> · built <date> · Next.js 15` linking sha to the GitHub commit, plus `colophon ↗` link (page comes in Phase 4; link to /colophon only once it exists). Keep social icons. One human sign-off line in italic: short, warm, hers.

### 2.10 Card outcome metrics

Add optional `outcome` display: for projects use `excerpt`-adjacent new column (`outcome` TEXT, migration + Supabase update by Chanrattnak), rendered as a mono line on the card: e.g. `2 days → 20 min` style deltas. Achievements already have `result`; render it in mono. Rename card meta labels: `CODING` renders as `Engineering`, `CASE_STUDY` renders as `Case study`.

Phase 2 acceptance: no framer-motion imports remain; hero interactive and accessible; About exists with real or hidden-placeholder experience; all pages use the new tokens; light and dark both AA; `npm run build` clean.

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

Order: Hero → Projects (featured) → Open Source → Achievements → Blog (conditional) → ConnectPanel. Ledger-rule headers throughout. Achievements list items lead with mono result.

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

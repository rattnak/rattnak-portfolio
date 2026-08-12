# rattnak.com

Personal portfolio of Chanrattnak Mong, Full-Stack Software Engineer. The site's thesis: **"I like making complicated things simpler."**

## Stack

- **Next.js 15** (App Router, React 19, TypeScript) with ISR: content pages revalidate on a schedule instead of rebuilding the whole site.
- **Supabase (Postgres)** stores all content: projects, achievements, open-source contributions, and blog posts. Data access lives in [`lib/database.ts`](lib/database.ts) via `supabase-js`.
- **Prisma** is used as the schema and migration tool only (see [`prisma/`](prisma/)); the runtime never touches the Prisma client.
- **Tailwind CSS v4** plus a hand-rolled design-token system in [`styles/globals.css`](styles/globals.css) (light/dark themes, no-flash theme script).

## Design system: "Instrumented"

A calm editorial surface with precise engineering instruments: monospace numerals, hairline ledger rules, and a signature interactive element, mostly machine precision with a little deliberate human warmth. Full spec in [`docs/REDESIGN_PLAN.md`](docs/REDESIGN_PLAN.md); the notes below capture decisions made during implementation that aren't in that plan.

**Tokens** (`styles/globals.css`): warm-paper light theme, blue-black dark theme, deep teal / phosphor teal accent. `--navbar-height` (`calc(4rem + 1px)`, header content height plus its bottom border) is the single source of truth for anything that needs to offset against the sticky header, the hero's `min-height` and the sticky back-link's `top` both read from it instead of duplicating the value.

**Typography**: self-hosted Switzer (sans) and JetBrains Mono (`.instrument` / `.instrument-label` utility classes), loaded via `next/font/local` from `public/fonts/`.

**Layout**: `.ledger-rule` is the repeating section-header pattern (hairline top border + mono eyebrow + heading on one baseline row), used for Work, Open Source, Achievements, Blog, and About. Labels are intentionally unnumbered since the sections aren't a sequence.

**Hero branding** (deviation from `docs/REDESIGN_PLAN.md` 2.4): the H1 is **Chanrattnak Mong**, not the thesis sentence, branding leads with the name. The thesis renders as a semibold subheading directly below, with the untangle-knot underline beneath it. The drawer mirrors the navbar's design language: its header row is exactly `--navbar-height` tall (Close sits where Menu was), every link row repeats that height (64px touch targets), all type matches the bar's 14px scale, and the footer's contact icon row is pinned at the drawer's bottom.

**Hero sizing**: `.hero-section` uses `min-height: 100dvh - var(--navbar-height)` (dvh so mobile Safari's collapsing URL bar doesn't cause overshoot) so it fills the first screen without "Work" peeking into view, and content is vertically centered within that space on every breakpoint (not just desktop). This is a floor, not a ceiling: if hero copy grows enough to exceed a short mobile viewport, trim vertical spacing before reaching for less content, min-height alone can't compress overflow. The subheading, proof paragraph, values line, and identity row all use wide `clamp()` ranges (not the sitewide `--text-*` tokens, which are intentionally subtle) so hero type visibly scales with viewport width rather than nudging by a pixel or two.

**Untangle knot** (`components/UntangleKnot.tsx`): the signature interactive element under the hero H1. Its SVG viewBox width tracks the container's real rendered width via `ResizeObserver` and keeps a 1:1 unit-to-pixel scale on both axes, this is required, not cosmetic: `preserveAspectRatio="none"` against a fixed viewBox stretched independently on X/Y and turned the round drag knots into ellipses at any width other than the design ratio. It also watches `data-simplified` (via `MutationObserver`) the same way it watches `prefers-reduced-motion`: both force the static solved state instead of the drag interaction, and both can flip mid-session, not just on mount.

**Mobile navigation**: the mobile menu is a right-anchored slide-in drawer (`.navbar-drawer`, portaled to `document.body` since `<header>`'s `backdrop-filter` would otherwise become the containing block for any `position: fixed` descendant and misplace it) with a dimmed backdrop, `translateX` transition, Escape-to-close, and body-scroll lock. The drawer mirrors the navbar's own type scale and row height rather than inventing its own.

**Navbar search**: `CommandPalette` takes a `variant` prop. `"search"` renders a wider, visibly search-styled trigger (placeholder "Search", positioned right after the logo, before the nav links) on desktop; `"icon"` renders the compact ⌘K-only trigger on mobile. Both open the same dialog, there is exactly one query input, not two that could drift out of sync.

**Tag colors** (`lib/tagColors.ts`): generated, not hand-typed. Each tag gets a distinct hue spaced by the golden angle (~137.5°) around the color wheel so no two tags in a list read as the same color; every light-mode text/background pair is verified programmatically to meet WCAG AA (>=4.5:1), and dark-mode variants are derived from the same hue as translucent overlays rather than separately hand-picked, so they can't drift out of sync with light mode.

**Card standardization**: all four card types (Project, Achievement, Blog, OpenSource) share one click model (title is a `.stretched-link`, secondary links like GitHub/PR stay independently clickable) and one meta-row order (category/type leads, the distinguishing outcome fact follows after a separator). `.blog-card-content` and `.competition-card-content` were byte-identical duplicates of `.project-card-content` and have been removed in favor of the one class.

**"Simplify this site"** (`components/SimplifyToggle.tsx`): sets `data-simplified` on `<html>`, persisted in `localStorage` and applied before paint via the same inline script that prevents theme flash. CSS kills all animation, maximizes contrast (pure ink/paper in both themes), and linearizes card grids to one column. Reachable from the footer and the command palette.

**Colophon** (`/colophon`): per-route rendering strategy table, stack, and type/color rationale. Linked from the footer's provenance line. `NEXT_PUBLIC_COMMIT_SHA` / `NEXT_PUBLIC_BUILD_TIME` are set in `next.config.ts` from Vercel's `VERCEL_GIT_COMMIT_SHA`, both are `undefined` locally and every consumer already handles that.

**Resume tracking** (`lib/resume-tracking.ts`, `/api/resume`, `/r/[slug]`): logs accesses to Supabase (service-role key, silently skipped if unconfigured or the user-agent matches a bot pattern), pings an optional webhook, then streams the PDF. Every step besides serving the file fails silently, tracking problems can never block a recruiter from the resume. Returns a friendly 503 with a link to `/contact` if the PDF hasn't been uploaded yet, which it hasn't: see the content checklist below.

**Contact form hardening**: a visually-hidden honeypot field (`website`) rejects bot submissions by pretending to succeed; an in-memory rate limit (5/hour per hashed IP) returns 429; the status message is an `aria-live="polite"` region.

## Content Chanrattnak still needs to supply

- Resume PDF, without the bare Gmail address, at `public/resume/chanrattnak-mong-resume.pdf`. Until then `/api/resume` and `/r/[slug]` return a friendly 503 rather than a broken download.
- Real experience entries for the About page's ledger table (`EXPERIENCE` in `app/about/page.tsx` is intentionally empty, the section hides itself rather than show placeholder data).
- The `ResumeLink` / `ResumeAccess` / `UntangleSolve` Prisma migration needs to actually be pushed to Supabase (`npm run db:push`), and `SUPABASE_SERVICE_ROLE_KEY`, `RESUME_SALT`, `NOTIFY_WEBHOOK_URL` need to be set in the environment before resume tracking or untangle-completion counts do anything.

## Architecture notes

- Server components by default; client components only where interaction requires them (theme toggle, filters, slideshows).
- Detail routes (`/projects/[id]`, `/achievements/[id]`, `/open-source/[slug]`, `/blog/[slug]`) are statically generated via `generateStaticParams` and revalidated.
- Supabase Row Level Security denies anonymous writes; content edits happen through the Supabase dashboard.
- The public email address is never rendered in server HTML (anti-scraping); contact goes through the form or a click-to-reveal endpoint.

## Development

```bash
npm install
cp .env.example .env   # fill in Supabase keys
npm run dev
```

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run db:push` | Push Prisma schema changes |
| `npm run db:studio` | Browse the database |

# rattnak.com

Personal portfolio of Chanrattnak Mong, Full-Stack Software Engineer. The site's thesis: **"I like making complicated things simpler."**

## Stack

- **Next.js 15** (App Router, React 19, TypeScript) with ISR: content pages revalidate on a schedule instead of rebuilding the whole site.
- **Supabase (Postgres)** stores all content: projects, achievements, open-source contributions, and blog posts. Data access lives in [`lib/database.ts`](lib/database.ts) via `supabase-js`.
- **Prisma** is used as the schema and migration tool only (see [`prisma/`](prisma/)); the runtime never touches the Prisma client.
- **Tailwind CSS v4** plus a hand-rolled design-token system in [`styles/globals.css`](styles/globals.css) (light/dark themes, no-flash theme script).

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

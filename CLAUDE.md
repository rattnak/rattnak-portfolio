# rattnak-portfolio

Personal portfolio site for Chanrattnak Mong. Next.js 15 App Router, React 19, Tailwind v4, Supabase (content), Prisma (migrations only).

## Content rules (strict)

- **NEVER use em dashes (—, U+2014) anywhere in website content**: page copy, component strings, alt text, metadata descriptions, blog posts, or database content (Project, Achievement, BlogPost, OpenSourceContribution, Tag). Use a comma, colon, period, or parentheses instead. When editing or seeding database content, scan for em dashes before writing.
- Voice: first person, plain-spoken, human. Brand thesis: "I like making complicated things simpler." Values line: "Humans come first. Technology should make their work better."
- Chanrattnak is a woman; use she/her in any third-person copy (metadata, JSON-LD, alt text, bios).
- **Email protection:** never render her email address as plain text or a static `mailto:` in server-rendered HTML. Use the click-to-reveal pattern (fetch from an API route on interaction, then copy/mailto). The contact form is the primary channel.

## Image organization (strict)

Images live in `public/`, foldered by content type and then by the item's **slug**, never its database id. The path mirrors the URL the image belongs to, so it is predictable from the page alone.

```
public/
  projects/<slug>/cover.jpg          e.g. projects/syncia/cover.jpg
  achievements/<slug>/cover.jpeg     e.g. achievements/ncae-cybergames-2025-west-region/scoreboard.jpeg
  open-source/<slug>/cover.png
  about/                             personal photos, not tied to a work item
```

Rules:
- **Slug, not id.** `public/achievements/5/` was the old pattern and is gone. An id in a path breaks the moment rows are reordered or reseeded, and tells a reader nothing.
- The slug in the path must match the row's `slug` column exactly, which is also what the URL uses.
- `cover.<ext>` is the card image. Additional images in the same folder take descriptive names (`scoreboard.jpeg`, `dashboard.png`), not numbers.
- Lowercase, hyphenated filenames. No spaces, no uppercase extensions (`.JPG` is a holdover, do not add more).
- Reference images by absolute path from the site root: `/projects/syncia/cover.jpg`.

Cover precedence, identical for all three types: `imageUrl` column, then the first image found in the body content (`overview` for projects, `content` for achievements), then the typographic fallback in `coverFallbackText`. Open source rows are grouped by `projectName`, so the first non-null `imageUrl` in a group becomes that card's cover.

When adding an image: put the file in the right slug folder, then set `imageUrl` on the row to its absolute path. Moving an image means updating both the file and every database reference in the same pass, or the link breaks.

## Architecture notes

- Data is fetched with supabase-js (`lib/database.ts`); Prisma is the schema/migration tool only.
- Pages use ISR (`revalidate`) with `generateStaticParams` for detail routes.
- Supabase RLS denies anonymous writes; content edits happen via the Supabase dashboard or service-role scripts, never the anon key.

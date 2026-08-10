# rattnak-portfolio

Personal portfolio site for Chanrattnak Mong. Next.js 15 App Router, React 19, Tailwind v4, Supabase (content), Prisma (migrations only).

## Content rules (strict)

- **NEVER use em dashes (—, U+2014) anywhere in website content**: page copy, component strings, alt text, metadata descriptions, blog posts, or database content (Project, Achievement, BlogPost, OpenSourceContribution, Tag). Use a comma, colon, period, or parentheses instead. When editing or seeding database content, scan for em dashes before writing.
- Voice: first person, plain-spoken, human. Brand thesis: "I like making complicated things simpler." Values line: "Humans come first. Technology should make their work better."
- Chanrattnak is a woman; use she/her in any third-person copy (metadata, JSON-LD, alt text, bios).
- **Email protection:** never render her email address as plain text or a static `mailto:` in server-rendered HTML. Use the click-to-reveal pattern (fetch from an API route on interaction, then copy/mailto). The contact form is the primary channel.

## Architecture notes

- Data is fetched with supabase-js (`lib/database.ts`); Prisma is the schema/migration tool only.
- Pages use ISR (`revalidate`) with `generateStaticParams` for detail routes.
- Supabase RLS denies anonymous writes; content edits happen via the Supabase dashboard or service-role scripts, never the anon key.

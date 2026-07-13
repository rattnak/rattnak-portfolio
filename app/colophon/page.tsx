// app/colophon/page.tsx
export const metadata = {
  title: "Colophon",
  description: "How this site works: stack, rendering strategy per route, fonts, and palette rationale.",
};

const ROUTES: { path: string; strategy: string; revalidate: string }[] = [
  { path: "/", strategy: "ISR", revalidate: "1 hour" },
  { path: "/projects/[slug]", strategy: "SSG + ISR", revalidate: "1 minute" },
  { path: "/open-source/[slug]", strategy: "SSG + ISR", revalidate: "1 hour" },
  { path: "/achievements/[slug]", strategy: "SSG", revalidate: "on demand" },
  { path: "/blog", strategy: "ISR", revalidate: "1 hour" },
  { path: "/blog/[slug]", strategy: "SSG", revalidate: "on demand" },
  { path: "/about", strategy: "Static", revalidate: "build time" },
  { path: "/contact", strategy: "301 -> /about#contact", revalidate: "n/a" },
  { path: "/api/*", strategy: "Dynamic (server-rendered)", revalidate: "n/a" },
];

const SHORT_SHA = process.env.NEXT_PUBLIC_COMMIT_SHA?.slice(0, 7);
const REPO_URL = "https://github.com/rattnak/rattnak-portfolio";

export default function ColophonPage() {
  return (
    <div style={{ minHeight: "calc(100vh - 4rem)" }}>
      <div className="container page-container" style={{ maxWidth: "42rem" }}>
        <div className="ledger-rule">
          <span className="instrument-label ledger-rule-label">colophon</span>
        </div>

        <h1 style={{ marginBottom: "1rem" }}>How this site works</h1>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
          This page exists because I like knowing how the tools I use work, and I figure some
          visitors do too. Everything below is accurate as of this deploy, not an aspirational
          spec.
        </p>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "0.75rem" }}>Stack</h2>
          <ul style={{ paddingLeft: "1.25rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <li>Next.js 15, App Router, React 19, TypeScript</li>
            <li>Tailwind CSS v4 plus a hand-rolled design token system in <code>styles/globals.css</code></li>
            <li>Supabase (Postgres) for content, read through <code>lib/database.ts</code> via <code>supabase-js</code></li>
            <li>Prisma as the schema and migration tool only, the runtime never touches the Prisma client</li>
            <li>No client-side animation library. CSS transitions and native <code>&lt;dialog&gt;</code> do the work</li>
          </ul>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "0.75rem" }}>Rendering per route</h2>
          <div className="colophon-table">
            <div className="colophon-table-header">
              <span>Route</span>
              <span>Strategy</span>
              <span>Revalidate</span>
            </div>
            {ROUTES.map((r) => (
              <div key={r.path} className="colophon-table-row">
                <span className="instrument">{r.path}</span>
                <span>{r.strategy}</span>
                <span className="instrument">{r.revalidate}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "0.75rem" }}>Type and color</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "0.75rem" }}>
            Switzer for prose, JetBrains Mono for anything meant to read like an instrument
            readout: dates, metrics, tags, section labels. Both are self-hosted as static woff2
            files rather than pulled from a font CDN.
          </p>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
            The palette is a warm paper light theme and a blue-black dark theme, built around one
            accent (deep teal in light mode, phosphor teal in dark) rather than a wide brand
            palette. Every skill tag gets its own hue, spaced by the golden angle around the color
            wheel so adjacent tags never read as the same color, verified programmatically to meet
            WCAG AA contrast rather than eyeballed.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "0.75rem" }}>This deploy</h2>
          <p className="instrument" style={{ color: "var(--text-secondary)" }}>
            {SHORT_SHA ? (
              <>
                commit{" "}
                <a href={`${REPO_URL}/commit/${process.env.NEXT_PUBLIC_COMMIT_SHA}`} target="_blank" rel="noopener noreferrer">
                  {SHORT_SHA}
                </a>{" "}
                &middot;{" "}
              </>
            ) : null}
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              source on GitHub
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

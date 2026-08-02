import Link from "next/link";
import UntangleKnot from "./UntangleKnot";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="container">
        <div>
          <p className="instrument-label" style={{ fontSize: "clamp(0.75rem, 0.72rem + 0.15vw, 0.875rem)", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
            Full-Stack Software Engineer
          </p>

          <h1 style={{ marginBottom: "0.75rem" }}>Chanrattnak Mong</h1>

          <p
            style={{
              fontSize: "clamp(1.125rem, 1rem + 1vw, 1.75rem)",
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
              marginBottom: "0",
            }}
          >
            I like making complicated things simpler.
          </p>

          <UntangleKnot />

          <p
            style={{
              fontSize: "clamp(1rem, 0.9rem + 0.6vw, 1.25rem)",
              color: "var(--text-secondary)",
              lineHeight: "1.6",
              maxWidth: "42rem",
              marginBottom: "0.875rem",
            }}
          >
            2+ years building backends in Python and Node.js: payment systems with live
            bank integrations, event-driven services, and agentic AI that removes
            repetitive work, across fintech, education, and cybersecurity.
          </p>

          <p
            style={{
              fontSize: "clamp(0.875rem, 0.82rem + 0.3vw, 1.0625rem)",
              fontStyle: "italic",
              color: "var(--text-muted)",
              marginBottom: "1.25rem",
            }}
          >
            Humans come first. Technology should make their work better.
          </p>

          <div className="flex flex-wrap gap-4" style={{ marginBottom: "1.25rem" }}>
            <Link href="/#work" className="btn btn-primary group">
              View work
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/about#contact" className="btn btn-secondary">
              Get in touch
            </Link>
          </div>

          {/* Identity line: text handles only. The email lives in the
              navbar as the envelope reveal button, never as text here. */}
          <div
            className="instrument"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "0.5rem 1rem",
              fontSize: "clamp(0.75rem, 0.72rem + 0.15vw, 0.875rem)",
              color: "var(--text-muted)",
            }}
          >
            <a href="https://github.com/rattnak" target="_blank" rel="noopener noreferrer" className="link-text">
              github.com/rattnak
            </a>
            <span aria-hidden="true">&middot;</span>
            <a href="https://linkedin.com/in/mongchanrattnak" target="_blank" rel="noopener noreferrer" className="link-text">
              linkedin.com/in/mongchanrattnak
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: '2rem',
        paddingBottom: '2rem',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60rem',
          height: '32rem',
          background: 'radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(20px)'
        }}
      />

      <div className="container" style={{ position: 'relative' }}>
        <div
          className="flex flex-col-reverse lg:flex-row"
          style={{ gap: '3rem', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="max-w-4xl text-center lg:text-left">
            <p
              className="text-sm mb-4"
              style={{
                color: 'var(--accent-primary)',
                fontWeight: 500,
                letterSpacing: '0.02em'
              }}
            >
              Full-Stack Software Engineer
            </p>

            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
              style={{
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
                lineHeight: '1.05'
              }}
            >
              Chanrattnak Mong
            </h1>

            <p
              className="text-base md:text-xl max-w-2xl mb-12"
              style={{
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              I build full-stack products end to end, from Postgres schemas and
              real-time backends to the React interfaces on top. Recent work spans
              a fintech payments app with live bank integrations and event-driven,
              high-concurrency systems.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link href="/projects" className="btn btn-primary group">
                View Projects
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/contact" className="btn btn-secondary group">
                Get in Touch
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="orbit-wrapper" style={{ flexShrink: 0 }}>
            <div className="orbit-plane orbit-plane-1" aria-hidden="true">
              <div className="orbit-path-ring" />
            </div>
            <div className="orbit-plane orbit-plane-2" aria-hidden="true">
              <div className="orbit-path-ring" />
            </div>
            <div className="orbit-plane orbit-plane-3" aria-hidden="true">
              <div className="orbit-path-ring" />
            </div>

            <div className="orbit-plane orbit-plane-1">
              <a
                href="https://github.com/rattnak"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
                className="orbit-icon"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>

            <div className="orbit-plane orbit-plane-2">
              <a
                href="https://linkedin.com/in/mongchanrattnak"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="orbit-icon"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>

            <div className="orbit-plane orbit-plane-3">
              <a
                href="https://x.com/rattnakmong"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                title="X (Twitter)"
                className="orbit-icon"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            <div className="orbit-nucleus">
              <div className="browser-window">
                <div className="browser-chrome">
                  <div className="browser-dots">
                    <span style={{ background: '#ff5f57' }} />
                    <span style={{ background: '#febc2e' }} />
                    <span style={{ background: '#28c840' }} />
                  </div>
                  <div className="browser-address">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2L4 6v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-4z" />
                    </svg>
                    rattnak.com
                  </div>
                  <div className="browser-ai-badge">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l1.8 5.6L19.5 9l-5.7 1.4L12 16l-1.8-5.6L4.5 9l5.7-1.4L12 2z" />
                      <path d="M19 14l.9 2.6L22.5 17l-2.6.9L19 20.5l-.9-2.6L15.5 17l2.6-.9L19 14z" />
                    </svg>
                    AI
                  </div>
                </div>
                <div className="browser-viewport">
                  <Image
                    src="/img/Chanrattnak_Mong.jpg"
                    alt="Chanrattnak Mong"
                    fill
                    priority
                    sizes="(max-width: 1024px) 70vw, 22rem"
                    className="object-cover"
                  />
                  <div className="browser-viewport-sheen" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

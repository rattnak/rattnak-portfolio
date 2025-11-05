"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="section" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="max-w-4xl">
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Software Engineer & Product Engineer
          </p>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
            style={{
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: '1.1'
            }}
          >
            Chanrattnak Mong
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mb-12"
            style={{
              color: 'var(--text-secondary)',
              lineHeight: '1.6'
            }}
          >
            Building elegant digital experiences through thoughtful design and clean code.
            Focused on creating products that are both beautiful and functional.
          </p>

          <div className="flex flex-wrap gap-4">
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
      </div>
    </section>
  );
}

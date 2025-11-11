// components/Services.tsx
export default function Services() {
  return (
    <section className="services-section">
      <div className="container services-container">
        <p style={{
          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 500
        }}>
          What I Do
        </p>

        <div className="services-grid">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Web Development
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Building modern, performant web applications with clean, maintainable code.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Product Engineering
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Designing scalable systems and APIs with focus on user experience.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              UI/UX Design
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Crafting intuitive interfaces that balance aesthetics with functionality.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// components/Services.tsx
export default function Services() {
  return (
    <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <p className="text-xs uppercase tracking-wider mb-12" style={{ color: 'var(--text-muted)' }}>
          What I Do
        </p>

        <div className="grid-3">
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

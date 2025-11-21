// components/Services.tsx
export default function Services() {
  const services = [
  {
    title: "Full-Stack Development",
    description: "Building end-to-end web and mobile applications with React, React Native, and modern backend frameworks like NestJS and Rails."
  },
  {
    title: "Product Engineering",
    description: "Owning the full product lifecycle from user research to production, balancing technical decisions with user needs."
  },
  {
    title: "Real-Time Systems",
    description: "Architecting WebSocket infrastructure and event-driven systems for high-concurrency, low-latency applications."
  }
];
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
          {services.map((service) => (
            <div key={service.title} className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {service.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
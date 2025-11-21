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
        <p className="services-section-title">
          What I Do
        </p>

        <div className="services-grid">
          {services.map((service) => (
            <div key={service.title} className="space-y-4">
              <h2 className="service-item-title">
                {service.title}
              </h2>
              <p className="service-item-description">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
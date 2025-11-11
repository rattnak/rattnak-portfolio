// app/contact/page.tsx
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact – Chanrattnak Mong",
  description: "Get in touch for collaboration opportunities",
};

export default function ContactPage() {
  return (
    <div style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <div className="container" style={{
        paddingTop: '4.5rem',
        paddingBottom: '4rem'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em'
          }}>
            Contact
          </h1>
          <p style={{
            fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            Have a project in mind or want to collaborate? I'm always open to discussing new opportunities and interesting ideas.
          </p>
        </div>

        {/* Contact Layout - Form on left, Image space on right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contact Form - Left Side */}
          <div>
            <ContactForm />
          </div>

          {/* Image Placeholder - Right Side */}
          <div
            className="hidden md:flex items-center justify-center"
            style={{
              height: '100%',
              minHeight: '300px',
              backgroundColor: 'var(--background-secondary)',
              borderRadius: '0.75rem',
              border: '2px dashed var(--border)',
              padding: '2rem'
            }}
          >
            <div style={{
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              textAlign: 'center'
            }}>
              <p style={{ marginBottom: '0.5rem' }}>Image Placeholder</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Add your friendly picture here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
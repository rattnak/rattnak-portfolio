// app/contact/page.tsx
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact – Chanrattnak Mong",
  description: "Get in touch for collaboration opportunities",
};

export default function ContactPage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 4rem)'
    }}>
      <div className="container" style={{
        maxWidth: '42rem',
        width: '100%',
        paddingTop: '4.5rem',
        paddingBottom: '4rem'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '1rem' }}>
          <h1 className="text-4xl md:text-5xl font-bold" style={{
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            Get in Touch 
          </h1>
          <p className="text-lg" style={{
            color: 'var(--text-secondary)',
            lineHeight: '1.7'
          }}>
            Have a project in mind or want to collaborate? I'm always open to discussing new opportunities and interesting ideas.
          </p>
        </div>

        {/* Contact Form */}
        <ContactForm />
      </div>
    </div>
  );
}
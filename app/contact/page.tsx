// app/contact/page.tsx
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact – Chanrattnak Mong",
  description: "Get in touch for collaboration opportunities",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Get In Touch
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Have a project in mind or want to collaborate? I'm always open to discussing new opportunities and interesting ideas.
          </p>
        </div>

        {/* Contact Form */}
        <ContactForm />
      </div>
    </div>
  );
}
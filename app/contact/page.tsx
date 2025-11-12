// app/contact/page.tsx
import ContactForm from "@/components/ContactForm";
import ImageSlider from "@/components/ImageSlider";

export const metadata = {
  title: "Contact - Chanrattnak Mong",
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
            Get in Touch
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

          {/* Image Slider - Right Side */}
          <ImageSlider
            images={[
              "/img/snowflake-founder.jpeg",
              "/img/seed-panelist.jpeg",
              "/img/seed-speech.jpeg",
              "/img/techpreneur-speech.JPG",
              "/img/huawei-speech.jpeg",
              "/img/seed-dubai.jpeg",
              "/img/dubai.jpeg"
            ]}
            interval={4000}
          />

        </div>
      </div>
    </div>
  );
}
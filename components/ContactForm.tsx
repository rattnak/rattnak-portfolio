"use client";
import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: "", // honeypot: hidden from real users, bots fill it
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("rate-limited");
        }
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "", website: "" });

      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error && error.message === "rate-limited"
          ? "Too many messages in a short time. Please wait a while and try again."
          : "Failed to send message. Please try again or reach me on LinkedIn."
      );
      console.error("Error sending message:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="contact-form"
    >
      {/* Honeypot: visually hidden and removed from the tab order and
          accessibility tree; the API rejects submissions that fill it. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label
          htmlFor="name"
          style={{
            fontSize: 'var(--text-ui)',
            fontWeight: 500,
            color: 'var(--text-primary)'
          }}
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="focus:outline-none focus:ring-2 transition-all"
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: 'var(--text-ui)',
            borderRadius: '0.5rem',
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            '--tw-ring-color': 'var(--accent-primary)',
          } as React.CSSProperties}
          placeholder="Your name"
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label
          htmlFor="email"
          style={{
            fontSize: 'var(--text-ui)',
            fontWeight: 500,
            color: 'var(--text-primary)'
          }}
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="focus:outline-none focus:ring-2 transition-all"
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: 'var(--text-ui)',
            borderRadius: '0.5rem',
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            '--tw-ring-color': 'var(--accent-primary)',
          } as React.CSSProperties}
          placeholder="your.email@example.com"
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label
          htmlFor="message"
          style={{
            fontSize: 'var(--text-ui)',
            fontWeight: 500,
            color: 'var(--text-primary)'
          }}
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          // Vertically resizable by drag (it was resize-none). Horizontal
          // resize stays off: widening it would break out of the form
          // column. minHeight keeps the handle from collapsing the field
          // to nothing, maxHeight stops it growing past the viewport.
          className="focus:outline-none focus:ring-2 transition-all"
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: 'var(--text-ui)',
            borderRadius: '0.5rem',
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            lineHeight: '1.6',
            resize: 'vertical',
            minHeight: '6rem',
            maxHeight: '70vh',
            '--tw-ring-color': 'var(--accent-primary)',
          } as React.CSSProperties}
          placeholder="Tell me about your project or collaboration idea..."
        />
      </div>

      {/* Status region: announced politely by screen readers on submit
          outcome without stealing focus. */}
      <div role="status" aria-live="polite">
        {status === "success" && (
          <div style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            backgroundColor: 'var(--accent-glow)',
            border: '1px solid var(--accent-primary)'
          }}>
            <p style={{
              fontSize: 'var(--text-ui)',
              fontWeight: 500,
              color: 'var(--accent-primary)',
              margin: 0
            }}>
              Thank you! Your message has been sent successfully. I'll get back to you soon.
            </p>
          </div>
        )}

        {status === "error" && (
          <div id="contact-form-error" style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--error)'
          }}>
            <p style={{
              fontSize: 'var(--text-ui)',
              fontWeight: 500,
              color: 'var(--error)',
              margin: 0
            }}>
              {errorMessage}
            </p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <button
          type="submit"
          aria-describedby={status === "error" ? "contact-form-error" : undefined}
          disabled={status === "submitting"}
          className="btn btn-primary group"
          style={{
            opacity: status === "submitting" ? 0.5 : 1,
            cursor: status === "submitting" ? 'not-allowed' : 'pointer',
            width: 'auto',
            minWidth: '10rem'
          }}
        >
          {status === "submitting" ? "Sending..." : "Send Message"}
          {status !== "submitting" && (
            <svg
              className="transition-transform group-hover:translate-x-0.5"
              style={{ width: '1rem', height: '1rem' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}

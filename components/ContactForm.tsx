"use client";
import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
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
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setErrorMessage("Failed to send message. Please try again or contact me directly via email.");
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label
          htmlFor="name"
          style={{
            fontSize: '0.875rem',
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
            fontSize: '0.9375rem',
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
            fontSize: '0.875rem',
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
            fontSize: '0.9375rem',
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
            fontSize: '0.875rem',
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
          className="focus:outline-none focus:ring-2 transition-all resize-none"
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: '0.9375rem',
            borderRadius: '0.5rem',
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            lineHeight: '1.6',
            '--tw-ring-color': 'var(--accent-primary)',
          } as React.CSSProperties}
          placeholder="Tell me about your project or collaboration idea..."
        />
      </div>

      {status === "success" && (
        <div style={{
          padding: '1rem',
          borderRadius: '0.5rem',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--accent-primary)',
            margin: 0
          }}>
            Thank you! Your message has been sent successfully. I'll get back to you soon.
          </p>
        </div>
      )}

      {status === "error" && (
        <div style={{
          padding: '1rem',
          borderRadius: '0.5rem',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#ef4444',
            margin: 0
          }}>
            {errorMessage}
          </p>
        </div>
      )}

      <div style={{ marginTop: '0.5rem' }}>
        <button
          type="submit"
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

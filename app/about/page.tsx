// app/about/page.tsx
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import ImageSlider from "@/components/ImageSlider";
import RevealEmail from "@/components/RevealEmail";

export const metadata = {
  title: "About",
  description:
    "Chanrattnak Mong is a full-stack software engineer who likes making complicated things simpler, across fintech, education, and cybersecurity.",
};

type ExperienceEntry = {
  dates: string;
  role: string;
  company: string;
  bullets: string[];
  outcome: string;
};

// CONTENT REQUIRED FROM CHANRATTNAK: real roles, dates, and outcomes.
// Until supplied, this stays empty and the section hides rather than
// show placeholder data as if it were real.
const EXPERIENCE: ExperienceEntry[] = [];

const SKILLS = [
  "Python",
  "Node.js",
  "TypeScript",
  "React",
  "Next.js",
  "PostgreSQL",
  "AWS",
  "Docker",
  "REST APIs",
  "Event-driven systems",
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "calc(100vh - 4rem)" }}>
      <div className="container page-container">
        <div className="ledger-rule">
          <span className="instrument-label ledger-rule-label">about</span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "2.5rem", marginBottom: "3rem" }}>
          <div style={{ flexShrink: 0 }}>
            <Image
              src="/img/Chanrattnak_Mong.jpg"
              alt="Chanrattnak Mong"
              width={200}
              height={200}
              style={{ borderRadius: "0.5rem", objectFit: "cover", width: "12rem", height: "12rem" }}
            />
          </div>

          <div style={{ flex: "1 1 28rem", maxWidth: "40rem" }}>
            <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "1.25rem" }}>
              I like making complicated things simpler.
            </h1>

            <div style={{ color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "var(--text-md)" }}>
              <p style={{ marginBottom: "1rem" }}>
                I&apos;m drawn to the parts of a system that are repetitive, fragmented, or held
                together by habit rather than design. Most of my work sits in that space: full
                stack products, APIs, integrations, automation, and lately, agentic AI that takes
                over the parts of a job that shouldn&apos;t need a human every time.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                Not every problem needs an AI solution. I&apos;d rather write a clear script or fix
                the underlying process than bolt a model onto something that just needed better
                plumbing. I care about accessibility and open source because good tools should
                work for the people who actually use them, not just the people who built them.
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                <strong>Humans come first. Technology should make their work better.</strong>
              </p>
            </div>
          </div>
        </div>

        {EXPERIENCE.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <div className="ledger-rule">
              <span className="instrument-label ledger-rule-label">experience</span>
            </div>
            <div className="about-experience-table">
              {EXPERIENCE.map((entry, i) => (
                <div key={i} className="about-experience-row">
                  <div className="instrument about-experience-dates">{entry.dates}</div>
                  <div className="about-experience-body">
                    <h3 style={{ fontSize: "var(--text-base)", marginBottom: "0.5rem" }}>
                      {entry.role} &middot; {entry.company}
                    </h3>
                    <ul style={{ margin: 0 }}>
                      {entry.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="instrument about-experience-outcome">{entry.outcome}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section style={{ marginBottom: "3rem" }}>
          <div className="ledger-rule">
            <span className="instrument-label ledger-rule-label">skills</span>
          </div>
          <div className="instrument about-skills-row">
            {SKILLS.map((skill) => (
              <span key={skill} className="about-skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Merged in from the old standalone /contact page; /contact 301s
            here. The heading is the line the footer used to carry: it
            belongs next to the form that answers it, not repeated on
            every page.

            RevealEmail sits under the form inside the left column, not
            as a full-width band above the grid (which split the section
            in two and pushed the form down). The form is the primary
            channel; the address is the fallback for people who would
            rather use their own mail client, so it follows the submit
            button in reading order. */}
        <section id="contact" style={{ scrollMarginTop: "5rem" }}>
          <div className="ledger-rule">
            <span className="instrument-label ledger-rule-label">get in touch</span>
          </div>

          <h2 className="contact-title">Let&apos;s build something simpler.</h2>

          <p style={{ fontSize: "var(--text-md)", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "1.75rem" }}>
            Have a project in mind or want to collaborate? I&apos;m always open to discussing new
            opportunities and interesting ideas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <ContactForm />
              <RevealEmail />
              <p className="contact-signoff">
                Thanks for stopping by. If something here is broken, I&apos;d genuinely like to know.
              </p>
            </div>

            <ImageSlider
              images={[
                "/img/snowflake-founder.jpeg",
                "/img/seed-panelist.jpeg",
                "/img/seed-speech.jpeg",
                "/img/techpreneur-speech.JPG",
                "/img/huawei-speech.jpeg",
                "/img/seed-dubai.jpeg",
                "/img/dubai.jpeg",
              ]}
              interval={4000}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

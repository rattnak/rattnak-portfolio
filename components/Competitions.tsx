// components/Competitions.tsx
import { getFeaturedCompetitions } from "@/lib/database";
import CompetitionListItem from "./AchievementListItem";

export default async function CompetitionsSection() {
  // Competitions are already sorted in getFeaturedCompetitions (featured first, then by date descending)
  const competitions = await getFeaturedCompetitions();

  return (
    <section id="competitions" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <h2 style={{
          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 500
        }}>
          Recognition
        </h2>

        {competitions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'clamp(4rem, 8vw, 6rem) 0',
            color: 'var(--text-muted)',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)'
          }}>
            <p>No achievements to display yet.</p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {competitions.map((competition) => (
              <CompetitionListItem key={competition.id} {...competition} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

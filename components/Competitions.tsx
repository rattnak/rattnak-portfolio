// components/Competitions.tsx
import { getFeaturedCompetitions } from "@/lib/database";
import CompetitionListItem from "./CompetitionListItem";

export default async function CompetitionsSection() {
  // Competitions are already sorted in getFeaturedCompetitions (featured first, then by date descending)
  const competitions = await getFeaturedCompetitions();

  return (
    <section id="competitions" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            Recognition
          </h2>
        </div>

        {competitions.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
            <p>No achievements to display yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {competitions.map((competition) => (
              <CompetitionListItem key={competition.id} {...competition} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

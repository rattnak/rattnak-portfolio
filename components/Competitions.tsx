// components/Competitions.tsx
import { mockCompetitions } from "@/lib/mockData";
import CompetitionListItem from "./CompetitionListItem";

export default async function CompetitionsSection() {
  // TODO: Switch back to getCompetitions() after database is synced
  // const competitions = await getCompetitions();

  // Sort competitions: featured first, then by date descending
  const competitions = [...mockCompetitions].sort((a, b) => {
    // Featured items come first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    // Then sort by date descending
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

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

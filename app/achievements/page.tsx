// app/achievements/page.tsx
import { getAllCompetitions } from "@/lib/database";
import CompetitionCard from "@/components/CompetitionCard";

export const metadata = {
  title: "Achievements – Chanrattnak Mong",
  description: "Awards, competitions, and recognition",
};

export default async function AchievementsPage() {
  // Competitions are already sorted in getAllCompetitions (featured first, then by date descending)
  const achievements = await getAllCompetitions();

  return (
    <div className="min-h-screen">
      <div className="container" style={{
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
            Achievements
          </h1>
          <p className="text-lg" style={{
            color: 'var(--text-secondary)',
            lineHeight: '1.7'
          }}>
            Recognition and accomplishments from hackathons, competitions, and academic excellence.
          </p>
        </div>

        {/* Achievements Grid */}
        {achievements.length === 0 ? (
          <div className="text-center" style={{
            padding: '6rem 0',
            color: 'var(--text-muted)'
          }}>
            <p>No achievements to display yet.</p>
          </div>
        ) : (
          <div className="grid-3">
            {achievements.map((achievement) => (
              <CompetitionCard key={achievement.id} {...achievement} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

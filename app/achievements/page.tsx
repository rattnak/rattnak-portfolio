// app/achievements/page.tsx
import { getAllCompetitions } from "@/lib/database";
import CompetitionCard from "@/components/AchievementCard";

export const metadata = {
  title: "Achievements - Chanrattnak Mong",
  description: "Awards, competitions, and recognition",
};

export default async function AchievementsPage() {
  // Competitions are already sorted in getAllCompetitions (featured first, then by date descending)
  const achievements = await getAllCompetitions();

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
            Achievements
          </h1>
          <p style={{
            fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
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

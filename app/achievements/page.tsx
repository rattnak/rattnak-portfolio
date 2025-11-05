// app/achievements/page.tsx
import { mockCompetitions } from "@/lib/mockData";
import CompetitionCard from "@/components/CompetitionCard";

export const metadata = {
  title: "Achievements – Chanrattnak Mong",
  description: "Awards, competitions, and recognition",
};

export default function AchievementsPage() {
  const achievements = mockCompetitions;

  return (
    <div className="min-h-screen" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Achievements
          </h1>
          <p className="text-lg max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
            Recognition and accomplishments from hackathons, competitions, and academic excellence.
          </p>
        </div>

        {/* Achievements List */}
        {achievements.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
            <p>No achievements to display yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {achievements.map((achievement) => (
              <CompetitionCard key={achievement.id} {...achievement} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

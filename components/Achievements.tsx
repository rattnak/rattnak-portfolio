// components/Achievements.tsx
import { getFeaturedAchievements } from "@/lib/database";
import AchievementListItem from "./AchievementListItem";

export default async function AchievementsSection() {
  const achievements = await getFeaturedAchievements();

  return (
    <section id="achievements" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <h2 className="services-section-title">
          Recognition
        </h2>

        {achievements.length === 0 ? (
          <div className="empty-state">
            <p>No achievements to display yet.</p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {achievements.map((achievement) => (
              <AchievementListItem key={achievement.id} {...achievement} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

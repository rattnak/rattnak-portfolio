// components/AchievementsClient.tsx
"use client";
import { useState } from "react";
import CompetitionCard from "./AchievementCard";

type Competition = {
  id: number;
  name: string;
  type: string;
  description: string;
  result: string;
  organizer?: string | null;
  imageUrl?: string | null;
  url?: string | null;
  tags?: string[];
  date: Date | string;
  featured?: boolean;
};

type Props = {
  initialAchievements: Competition[];
};

export default function AchievementsClient({ initialAchievements }: Props) {
  const [achievements, setAchievements] = useState(initialAchievements);

  const toggleFeatured = async (id: number) => {
    // Optimistically update the UI
    setAchievements((prev) =>
      prev.map((achievement) =>
        achievement.id === id
          ? { ...achievement, featured: !achievement.featured }
          : achievement
      ).sort((a, b) => {
        // Featured items come first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;

        // Then sort by date descending
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
    );

    // TODO: Add API call to persist the change
    // try {
    //   await fetch(`/api/achievements/${id}/toggle-featured`, {
    //     method: 'PATCH',
    //   });
    // } catch (error) {
    //   console.error('Failed to toggle featured status:', error);
    //   // Revert on error
    //   setAchievements(initialAchievements);
    // }
  };

  return (
    <>
      <div className="grid-3">
        {achievements.map((achievement) => (
          <div key={achievement.id} style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFeatured(achievement.id);
              }}
              className="achievement-featured-toggle"
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                zIndex: 10,
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: '50%',
                border: achievement.featured
                  ? '2px solid var(--accent-primary)'
                  : '2px solid var(--border)',
                backgroundColor: achievement.featured
                  ? 'var(--accent-primary)'
                  : 'var(--background)',
                color: achievement.featured
                  ? '#ffffff'
                  : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.125rem',
                transition: 'all 0.2s ease',
                boxShadow: achievement.featured
                  ? '0 4px 12px rgba(59, 130, 246, 0.4)'
                  : '0 2px 6px rgba(0,0,0,0.1)',
              }}
              title={achievement.featured ? 'Remove from featured' : 'Add to featured'}
              aria-label={achievement.featured ? 'Remove from featured' : 'Add to featured'}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {achievement.featured ? '★' : '☆'}
            </button>
            <CompetitionCard {...achievement} />
          </div>
        ))}
      </div>
    </>
  );
}

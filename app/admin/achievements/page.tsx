import Link from 'next/link';
import { checkAdminAccess } from '@/lib/auth';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { prisma } from '@/lib/prisma';

export default async function AchievementsPage() {
  await checkAdminAccess();

  const achievements = await prisma.competition.findMany({
    orderBy: [
      { featured: 'desc' },
      { date: 'desc' },
    ],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Achievements</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Manage your competitions, awards, and achievements
          </p>
        </div>
        <Link href="/admin/achievements/new" className="btn-primary">
          Add Achievement
        </Link>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-lg">
          <p className="text-[var(--text-secondary)] mb-4">No achievements yet</p>
          <Link href="/admin/achievements/new" className="btn-primary">
            Add Your First Achievement
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="p-6 border border-[var(--border)] rounded-lg bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)] transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                      {achievement.name}
                    </h3>
                    {achievement.featured && (
                      <span className="px-2 py-1 text-xs font-medium bg-[var(--accent-primary)] text-white rounded">
                        ⭐ Featured
                      </span>
                    )}
                    <span className="px-2 py-1 text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded">
                      {achievement.type}
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary)] mb-2">
                    {achievement.description}
                  </p>
                  <p className="text-sm font-medium text-[var(--accent-primary)] mb-3">
                    {achievement.result}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {achievement.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">
                    {new Date(achievement.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/achievements/${achievement.id}`}
                    className="btn-secondary text-sm"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    id={achievement.id}
                    type="achievement"
                    name={achievement.name}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// components/AchievementDetailClient.tsx
"use client";
import Link from "next/link";
import Tag from "./Tag";

type Achievement = {
  id: number;
  name: string;
  type: string;
  description: string;
  result: string;
  organizer: string;
  imageUrl?: string | null;
  url?: string | null;
  tags?: string[];
  date: Date | string;
  featured?: boolean;
};

type Props = {
  achievement: Achievement;
};

export default function AchievementDetailClient({ achievement }: Props) {
  return (
    <div className="min-h-screen" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
      <div className="container max-w-4xl">
        {/* Back button */}
        <Link
          href="/achievements"
          className="inline-flex items-center gap-2 text-sm link-text mb-8 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Achievements
        </Link>

        {/* Achievement header */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1 rounded-full font-medium" style={{
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              color: 'var(--accent-primary)',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              {achievement.type}
            </span>
            {achievement.featured && (
              <span className="text-xs px-3 py-1 rounded-full font-medium" style={{
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                color: '#f59e0b',
                border: '1px solid rgba(251, 191, 36, 0.2)'
              }}>
                Featured
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {achievement.name}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#f59e0b' }}>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {achievement.result}
              </span>
            </div>
            {achievement.organizer && (
              <>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {achievement.organizer}
                </span>
              </>
            )}
          </div>

          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {achievement.description}
          </p>

          {/* Tags */}
          {achievement.tags && achievement.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {achievement.tags.map((tag, idx) => (
                <Tag key={idx} size="md">
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          {/* Action button */}
          {achievement.url && (
            <div className="pt-4">
              <a
                href={achievement.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary group"
              >
                View Details
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          )}
        </div>

        {/* Achievement details */}
        <div className="rounded-xl p-8 space-y-6" style={{
          backgroundColor: 'var(--background-secondary)',
          border: '1px solid var(--border)'
        }}>
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Date
              </h3>
              <p className="text-base" style={{ color: 'var(--text-primary)' }}>
                {new Date(achievement.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Category
              </h3>
              <p className="text-base" style={{ color: 'var(--text-primary)' }}>
                {achievement.type}
              </p>
            </div>

            {achievement.organizer && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  Organized By
                </h3>
                <p className="text-base" style={{ color: 'var(--text-primary)' }}>
                  {achievement.organizer}
                </p>
              </div>
            )}
          </div>

          {achievement.imageUrl && (
            <div className="mt-8">
              <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-muted)' }}>
                Certificate / Media
              </h3>
              <div className="rounded-lg aspect-video flex items-center justify-center" style={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)'
              }}>
                <span style={{ color: 'var(--text-muted)' }}>Image/certificate would appear here</span>
              </div>
            </div>
          )}
        </div>

        {/* Back button at bottom */}
        <div className="mt-16 pt-16" style={{ borderTop: '1px solid var(--border)' }}>
          <Link
            href="/achievements"
            className="inline-flex items-center gap-2 text-sm link-text group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Achievements
          </Link>
        </div>
      </div>
    </div>
  );
}

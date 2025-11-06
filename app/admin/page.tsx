import Link from 'next/link';
import { checkAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  // Check admin access
  await checkAdminAccess();
  // Get counts for dashboard stats
  const [projectCount, achievementCount, blogCount] = await Promise.all([
    prisma.project.count(),
    prisma.competition.count(),
    prisma.blogPost.count(),
  ]);

  const [featuredProjects, featuredAchievements, publishedBlogs] = await Promise.all([
    prisma.project.count({ where: { featured: true } }),
    prisma.competition.count({ where: { featured: true } }),
    prisma.blogPost.count({ where: { published: true } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Dashboard
        </h1>
        <p className="text-[var(--text-secondary)]">
          Manage your portfolio content
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Projects"
          count={projectCount}
          featured={featuredProjects}
          href="/admin/projects"
          icon="📁"
        />
        <StatsCard
          title="Achievements"
          count={achievementCount}
          featured={featuredAchievements}
          href="/admin/achievements"
          icon="🏆"
        />
        <StatsCard
          title="Blog Posts"
          count={blogCount}
          featured={publishedBlogs}
          href="/admin/blog"
          icon="✍️"
          featuredLabel="Published"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="Add Project"
            description="Create a new project or case study"
            href="/admin/projects/new"
            icon="➕"
          />
          <QuickActionCard
            title="Add Achievement"
            description="Document a competition or award"
            href="/admin/achievements/new"
            icon="➕"
          />
          <QuickActionCard
            title="Write Blog Post"
            description="Publish a new blog article"
            href="/admin/blog/new"
            icon="➕"
          />
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  count,
  featured,
  href,
  icon,
  featuredLabel = 'Featured',
}: {
  title: string;
  count: number;
  featured: number;
  href: string;
  icon: string;
  featuredLabel?: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)] transition-all hover:shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl">{icon}</span>
          <span className="text-3xl font-bold text-[var(--text-primary)]">{count}</span>
        </div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          {featured} {featuredLabel}
        </p>
      </div>
    </Link>
  );
}

function QuickActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)] transition-all hover:shadow-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
            <p className="text-sm text-[var(--text-secondary)]">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

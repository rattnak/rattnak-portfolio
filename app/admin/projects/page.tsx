import Link from 'next/link';
import { checkAdminAccess } from '@/lib/auth';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { prisma } from '@/lib/prisma';

export default async function ProjectsPage() {
  await checkAdminAccess();

  const projects = await prisma.project.findMany({
    orderBy: [
      { featured: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Projects</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Manage your coding projects and case studies
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary">
          Add Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-lg">
          <p className="text-[var(--text-secondary)] mb-4">No projects yet</p>
          <Link href="/admin/projects/new" className="btn-primary">
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-6 border border-[var(--border)] rounded-lg bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)] transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                      {project.name}
                    </h3>
                    {project.featured && (
                      <span className="px-2 py-1 text-xs font-medium bg-[var(--accent-primary)] text-white rounded">
                        ⭐ Featured
                      </span>
                    )}
                    <span className="px-2 py-1 text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded">
                      {project.type}
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary)] mb-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 text-sm text-[var(--text-muted)]">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--accent-primary)]"
                      >
                        GitHub →
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--accent-primary)]"
                      >
                        Live Site →
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="btn-secondary text-sm"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    id={project.id}
                    type="project"
                    name={project.name}
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

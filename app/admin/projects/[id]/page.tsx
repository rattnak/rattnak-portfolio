import { notFound } from 'next/navigation';
import { checkAdminAccess } from '@/lib/auth';
import { ProjectForm } from '@/components/admin/ProjectForm';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await checkAdminAccess();
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id: parseInt(id) },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/projects"
          className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 inline-block"
        >
          ← Back to Projects
        </Link>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Edit Project</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Update {project.name}
        </p>
      </div>

      <div className="p-6 border border-[var(--border)] rounded-lg bg-[var(--bg-secondary)]">
        <ProjectForm project={project} mode="edit" />
      </div>
    </div>
  );
}

import { checkAdminAccess } from '@/lib/auth';
import { ProjectForm } from '@/components/admin/ProjectForm';
import Link from 'next/link';

export default async function NewProjectPage() {
  await checkAdminAccess();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/projects"
          className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 inline-block"
        >
          ← Back to Projects
        </Link>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">New Project</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Create a new coding project or case study
        </p>
      </div>

      <div className="p-6 border border-[var(--border)] rounded-lg bg-[var(--bg-secondary)]">
        <ProjectForm mode="create" />
      </div>
    </div>
  );
}

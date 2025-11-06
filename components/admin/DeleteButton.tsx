'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type DeleteButtonProps = {
  id: number;
  type: 'project' | 'achievement' | 'blog';
  name: string;
};

export function DeleteButton({ id, type, name }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const endpoint =
        type === 'project'
          ? `/api/admin/projects/${id}`
          : type === 'achievement'
          ? `/api/admin/achievements/${id}`
          : `/api/admin/blog/${id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      router.refresh();
    } catch (error) {
      alert('Failed to delete. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Confirm'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1.5 text-sm border border-[var(--border)] rounded hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-3 py-1.5 text-sm text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition-colors"
    >
      Delete
    </button>
  );
}

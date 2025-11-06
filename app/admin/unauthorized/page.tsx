import Link from 'next/link';
import { SignOutButton } from '@clerk/nextjs';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-6">🔒</div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
          Access Denied
        </h1>
        <p className="text-[var(--text-secondary)] mb-6">
          You don't have permission to access the admin panel. This area is restricted to authorized administrators only.
        </p>
        <div className="flex flex-col gap-3">
          <SignOutButton>
            <button className="btn-primary w-full">
              Sign Out
            </button>
          </SignOutButton>
          <Link href="/" className="btn-secondary w-full">
            Return to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}

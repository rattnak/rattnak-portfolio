import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Admin Sign In
          </h1>
          <p className="text-[var(--text-secondary)]">
            Sign in to manage your portfolio content
          </p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}

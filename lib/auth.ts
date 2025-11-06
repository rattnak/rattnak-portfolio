import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function checkAdminAccess() {
  const user = await currentUser();

  if (!user) {
    redirect('/admin/sign-in');
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const userEmail = user.emailAddresses[0]?.emailAddress;

  if (userEmail !== adminEmail) {
    // User is signed in but not authorized
    redirect('/admin/unauthorized');
  }

  return user;
}

export async function isAdmin() {
  try {
    const user = await currentUser();
    if (!user) return false;

    const adminEmail = process.env.ADMIN_EMAIL;
    const userEmail = user.emailAddresses[0]?.emailAddress;

    return userEmail === adminEmail;
  } catch {
    return false;
  }
}

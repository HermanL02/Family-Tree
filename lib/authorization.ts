'use client';

import { useUser } from '@clerk/nextjs';

/**
 * Client-side hook to check if the current user is an authorized editor
 * @returns boolean indicating if user can edit
 */
export function useIsAuthorizedEditor(): boolean {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return false;
  }

  const authorizedEmails = (process.env.NEXT_PUBLIC_AUTHORIZED_EDITOR_EMAILS || '')
    .split(',')
    .map(email => email.trim())
    .filter(Boolean);

  const userEmail = user.primaryEmailAddress?.emailAddress;

  if (!userEmail) {
    return false;
  }

  return authorizedEmails.includes(userEmail);
}

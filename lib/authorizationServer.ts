import { auth, clerkClient } from '@clerk/nextjs/server';

/**
 * Server-side function to check if the current user is an authorized editor
 * @returns Promise<boolean> indicating if user can edit
 */
export async function isAuthorizedEditor(): Promise<boolean> {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  try {
    const user = await (await clerkClient()).users.getUser(userId);
    const authorizedEmails = (process.env.AUTHORIZED_EDITOR_EMAILS || '')
      .split(',')
      .map(email => email.trim())
      .filter(Boolean);

    const userEmail = user.emailAddresses.find(
      email => email.id === user.primaryEmailAddressId
    )?.emailAddress;

    if (!userEmail) {
      return false;
    }

    return authorizedEmails.includes(userEmail);
  } catch (error) {
    console.error('Error checking authorization:', error);
    return false;
  }
}

/**
 * Gets the current authenticated user ID
 * @returns Promise<string | null> user ID or null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createIntlMiddleware from 'next-intl/middleware';

// next-intl configuration
const intlMiddleware = createIntlMiddleware({
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
});

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/zh',
  '/en',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/zh/sign-in(.*)',
  '/en/sign-in(.*)',
  '/zh/sign-up(.*)',
  '/en/sign-up(.*)',
]);

export default clerkMiddleware((auth, request) => {
  // Skip locale handling for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    if (!isPublicRoute(request)) {
      auth.protect();
    }
    return;
  }

  // Protect all routes except public ones
  if (!isPublicRoute(request)) {
    auth.protect();
  }

  // Run intl middleware for locale handling
  return intlMiddleware(request);
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// The API route performs its own auth() check so unauthenticated clients receive JSON 401s.
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

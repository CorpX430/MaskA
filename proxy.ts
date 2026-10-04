import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
const hasClerkConfiguration = Boolean(
  (process.env.CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
    && process.env.CLERK_SECRET_KEY,
);

// Keeping readiness public lets Render identify a missing environment configuration
// instead of reporting an unhealthy container. With Clerk configured, dashboard
// requests remain protected at the edge and the API validates the user again.
const proxy = hasClerkConfiguration
  ? clerkMiddleware(async (auth, request) => {
      if (isProtectedRoute(request)) {
        await auth.protect();
      }
    })
  : () => NextResponse.next();

export default proxy;

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

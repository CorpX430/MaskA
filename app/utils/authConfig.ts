export function hasClerkConfiguration() {
  const publishableKey = process.env.CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return Boolean(publishableKey && process.env.CLERK_SECRET_KEY);
}

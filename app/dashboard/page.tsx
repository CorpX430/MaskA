import DashboardClient from './DashboardClient';

// Keep Clerk-dependent dashboard rendering out of the Docker build's static prerender pass.
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return <DashboardClient />;
}

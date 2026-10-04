import Link from 'next/link';
import DashboardClient from './DashboardClient';
import { hasClerkConfiguration } from '@/app/utils/authConfig';

// Keep Clerk-dependent dashboard rendering out of the Docker build's static prerender pass.
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  if (!hasClerkConfiguration()) {
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <div className="max-w-md">
          <p className="eyebrow">Private studio</p>
          <h1 className="mt-3 font-display text-2xl font-bold text-paper">Authentication setup is in progress.</h1>
          <p className="mt-3 text-sm leading-6 text-muted">This workspace opens as soon as the production Clerk keys are configured.</p>
          <Link href="/" className="primary-button mt-6">Back home</Link>
        </div>
      </main>
    );
  }

  return <DashboardClient />;
}

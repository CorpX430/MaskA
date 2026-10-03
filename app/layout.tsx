import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mask AI — Make the next reply count',
  description: 'A sharper reply before your next scroll.',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#070707',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Render uses the non-public alias at runtime so the Docker build does not need
  // to expose a browser key. Local and managed Preview continue using NEXT_PUBLIC_….
  const publishableKey = process.env.CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const content = <html lang="en"><body>{children}</body></html>;

  return publishableKey ? <ClerkProvider publishableKey={publishableKey}>{content}</ClerkProvider> : content;
}

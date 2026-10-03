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
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}

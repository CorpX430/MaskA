import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';
import { hasClerkConfiguration } from '@/app/utils/authConfig';

export default function SignInPage() {
  if (!hasClerkConfiguration()) {
    return <main className="grid min-h-screen place-items-center bg-ink px-4 py-10 text-center"><div><p className="eyebrow">Mask AI</p><h1 className="mt-3 font-display text-2xl font-bold">Sign-in is being configured.</h1><Link href="/" className="primary-button mt-6">Back home</Link></div></main>;
  }

  return <main className="grid min-h-screen place-items-center bg-ink px-4 py-10"><SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" /></main>;
}

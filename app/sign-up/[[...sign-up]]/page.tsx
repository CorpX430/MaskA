import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';
import { hasClerkConfiguration } from '@/app/utils/authConfig';

export default function SignUpPage() {
  if (!hasClerkConfiguration()) {
    return <main className="grid min-h-screen place-items-center bg-ink px-4 py-10 text-center"><div><p className="eyebrow">Mask AI</p><h1 className="mt-3 font-display text-2xl font-bold">Sign-up is being configured.</h1><Link href="/" className="primary-button mt-6">Back home</Link></div></main>;
  }

  return <main className="grid min-h-screen place-items-center bg-ink px-4 py-10"><SignUp path="/sign-up" routing="path" signInUrl="/sign-in" /></main>;
}

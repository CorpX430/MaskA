import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return <main className="grid min-h-screen place-items-center bg-ink px-4 py-10"><SignUp path="/sign-up" routing="path" signInUrl="/sign-in" /></main>;
}

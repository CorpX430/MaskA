import Link from 'next/link';
import {
  ArrowUpRight,
  Check,
  Copy,
  Feather,
  LogIn,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { hasClerkConfiguration } from '@/app/utils/authConfig';

function Mark({ small = false }: { small?: boolean }) {
  return (
    <div className={`relative grid place-items-center rounded-2xl bg-mint text-black shadow-[0_0_30px_rgba(115,247,187,.14)] ${small ? 'h-9 w-9' : 'h-11 w-11'}`} aria-label="Mask AI mark">
      <span className="font-display text-xl font-black tracking-[-.16em]">M</span>
      <span className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-black" />
    </div>
  );
}

function AuthHeader({ authReady }: { authReady: boolean }) {
  if (!authReady) return <span className="text-xs text-muted">Sign-in configuration pending</span>;

  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="ghost-button !rounded-full !px-4 !py-2.5 text-xs">Sign in <LogIn size={14} /></button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <Link href="/dashboard" className="ghost-button !rounded-full !px-4 !py-2.5 text-xs">Open studio <ArrowUpRight size={14} /></Link>
        <UserButton appearance={{ elements: { avatarBox: 'h-8 w-8' } }} />
      </SignedIn>
    </>
  );
}

function PrimaryAction({ authReady }: { authReady: boolean }) {
  if (!authReady) {
    return <span className="inline-flex items-center justify-center rounded-xl border border-line bg-white/[0.03] px-5 py-3.5 text-sm font-bold text-muted">Studio setup in progress</span>;
  }

  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="primary-button w-full sm:w-auto">Open your reply studio <ArrowUpRight size={17} /></button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <Link href="/dashboard" className="primary-button w-full sm:w-auto">Open your reply studio <ArrowUpRight size={17} /></Link>
      </SignedIn>
    </>
  );
}

export default function Home() {
  const authReady = hasClerkConfiguration();

  return (
    <main className="min-h-screen overflow-hidden px-5 pb-10 pt-5 sm:px-8">
      <header className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Mask AI home">
          <Mark small />
          <span className="font-display text-lg font-bold tracking-tight">mask<span className="text-mint">.ai</span></span>
        </Link>
        <div className="flex items-center gap-3"><AuthHeader authReady={authReady} /></div>
      </header>

      <section className="relative mx-auto max-w-6xl pb-16 pt-20 sm:pb-24 sm:pt-28">
        <div className="max-w-3xl">
          <div className="eyebrow mb-5 flex items-center gap-2"><span className="h-px w-8 bg-mint" /> Reply intelligence for the timeline</div>
          <h1 className="font-display text-[clamp(3.4rem,10vw,7.7rem)] font-bold leading-[.88] tracking-[-.07em] text-paper">
            Make the next
            <span className="block text-mint">reply count.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-muted sm:text-lg">
            Mask AI turns a post you care about into a reply that adds something. Bring the thought. We&apos;ll shape the signal.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <PrimaryAction authReady={authReady} />
            <span className="text-center text-xs text-muted sm:text-left">Secure server-side AI · posting stays manual</span>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-20 top-16 hidden h-80 w-80 rounded-full border border-electric/20 sm:block" />
        <div className="pointer-events-none absolute -right-5 top-31 hidden h-64 w-64 rounded-full border border-mint/15 sm:block" />
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 border-t border-line pt-5 sm:grid-cols-3 sm:gap-5">
        {[
          { icon: Feather, title: 'Start with context', body: 'Paste the post or drop in its URL. No social API access required.' },
          { icon: WandSparkles, title: 'Choose your edge', body: 'Shift from thoughtful to bold, playful, or polished in one tap.' },
          { icon: Copy, title: 'Post with intent', body: 'Copy the final line or open it directly in an X compose window.' },
        ].map(({ icon: Icon, title, body }, index) => (
          <div key={title} className="surface rounded-2xl p-5 sm:p-6">
            <div className="mb-10 flex items-center justify-between"><Icon size={18} className="text-mint" /><span className="font-mono text-[10px] text-muted">0{index + 1}</span></div>
            <h2 className="font-display text-lg font-semibold text-paper">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-4 max-w-6xl rounded-2xl border border-mint/20 bg-mint/[0.06] p-5 sm:mt-5 sm:flex sm:items-center sm:justify-between sm:p-6">
        <div className="flex gap-3"><Sparkles className="mt-0.5 shrink-0 text-mint" size={18} /><div><p className="text-sm font-semibold text-paper">Designed for the moment before you hit send.</p><p className="mt-1 text-xs leading-5 text-muted">Mask AI keeps your writing human, specific, and yours.</p></div></div>
        <div className="mt-4 flex items-center gap-2 text-xs text-mint sm:mt-0"><Check size={14} /> Server-protected credentials</div>
      </section>
    </main>
  );
}

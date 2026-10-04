'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Clock3, Link2, LockKeyhole, MessageSquareText, RotateCcw, Sparkles, UserRound } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ReplyOutput from '@/app/components/ReplyOutput';
import { DEFAULT_OPENROUTER_MODEL, OPENROUTER_MODEL_OPTIONS } from '@/app/utils/modelCatalog';

type Persona = 'insightful' | 'bold' | 'humorous' | 'professional';
type HistoryItem = { id: string; tweetText: string; persona: string; reply: string; createdAt: string };

const personas: { value: Persona; label: string; detail: string; accent: string }[] = [
  { value: 'insightful', label: 'Insightful', detail: 'Add a useful angle', accent: 'I' },
  { value: 'bold', label: 'Bold', detail: 'Push the idea forward', accent: 'B' },
  { value: 'humorous', label: 'Humorous', detail: 'Keep it light', accent: 'H' },
  { value: 'professional', label: 'Professional', detail: 'Sound credible', accent: 'P' },
];

function timeAgo(date: string) {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [tweetUrl, setTweetUrl] = useState('');
  const [tweetText, setTweetText] = useState('');
  const [persona, setPersona] = useState<Persona>('insightful');
  const [model, setModel] = useState(DEFAULT_OPENROUTER_MODEL);
  const [reply, setReply] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) return;
    Promise.all([
      fetch('/api/preferences').then((response) => response.json()),
      fetch('/api/history').then((response) => response.json()),
    ]).then(([preferences, storedHistory]) => {
      if (preferences.defaultPersona && personas.some((item) => item.value === preferences.defaultPersona)) setPersona(preferences.defaultPersona);
      if (Array.isArray(storedHistory.history)) setHistory(storedHistory.history);
    }).catch(() => undefined).finally(() => setHistoryLoading(false));
  }, [isSignedIn]);

  if (!isLoaded) return <div className="grid min-h-screen place-items-center text-sm text-muted">Loading your studio…</div>;
  if (!isSignedIn) return <div className="grid min-h-screen place-items-center px-6 text-center"><div><p className="eyebrow">Private studio</p><h1 className="mt-3 font-display text-2xl font-bold">Sign in to keep going.</h1><Link href="/sign-in" className="primary-button mt-6">Sign in</Link></div></div>;

  const firstName = user?.firstName || 'there';
  const choosePersona = (value: Persona) => {
    setPersona(value);
    fetch('/api/preferences', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ defaultPersona: value }) }).catch(() => undefined);
  };

  const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tweetUrl.trim() && !tweetText.trim()) return setError('Add a post URL or paste the post text first.');
    setLoading(true); setError(''); setReply('');
    try {
      const response = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tweetUrl, tweetText, persona, model }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to generate a reply.');
      setReply(data.reply);
      const refreshed = await fetch('/api/history');
      const refreshedData = await refreshed.json();
      if (Array.isArray(refreshedData.history)) setHistory(refreshedData.history);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to generate a reply.');
    } finally { setLoading(false); }
  };

  const reset = () => { setReply(''); setError(''); setTweetUrl(''); setTweetText(''); };
  const loadHistoryItem = (item: HistoryItem) => { setReply(item.reply); setTweetText(item.tweetText === '(URL only)' ? '' : item.tweetText); setPersona((item.persona as Persona) || 'insightful'); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <main className="min-h-screen px-4 pb-12 pt-4 sm:px-8">
      <header className="mx-auto flex max-w-5xl items-center justify-between border-b border-line pb-4">
        <Link href="/" className="flex items-center gap-3 text-sm text-paper"><span className="grid h-8 w-8 place-items-center rounded-xl bg-mint font-display font-black text-black">M</span><span className="font-display font-bold">mask<span className="text-mint">.ai</span></span></Link>
        <div className="flex items-center gap-3"><span className="hidden text-xs text-muted sm:block">Signed in as {user?.primaryEmailAddress?.emailAddress || firstName}</span><UserButton appearance={{ elements: { avatarBox: 'h-8 w-8' } }} /></div>
      </header>

      <div className="mx-auto max-w-5xl pt-8">
        <div className="mb-8 flex items-end justify-between gap-4"><div><Link href="/" className="mb-5 inline-flex items-center gap-1.5 text-xs text-muted transition hover:text-paper"><ArrowLeft size={13} /> Home</Link><p className="eyebrow">Reply studio / 01</p><h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl">Hey {firstName}, what&apos;s the thought?</h1><p className="mt-2 max-w-lg text-sm leading-6 text-muted">Give Mask AI the context. You decide the voice; it will find the line worth sending.</p></div><div className="hidden rounded-full border border-line px-3 py-1.5 text-[10px] font-medium text-muted sm:block"><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-mint" /> Secure server connection</div></div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr] lg:items-start">
          <form onSubmit={handleGenerate} className="surface rounded-2xl p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-electric/10 text-electric"><MessageSquareText size={17} /></span><div><p className="eyebrow text-electric">Start with context</p><p className="mt-1 text-xs text-muted">One source is enough</p></div></div><span className="font-mono text-[10px] text-muted">01 / 03</span></div>
            <div className="space-y-4">
              <label className="block"><span className="mb-2 flex items-center gap-2 text-xs font-semibold text-paper"><Link2 size={13} className="text-muted" /> Post URL <span className="font-normal text-muted">optional</span></span><input className="field" value={tweetUrl} onChange={(event) => setTweetUrl(event.target.value)} maxLength={2000} placeholder="https://x.com/username/status/…" /></label>
              <label className="block"><span className="mb-2 flex items-center justify-between text-xs font-semibold text-paper"><span>Or paste the post text</span><span className="font-normal text-muted">{tweetText.length}/2,000</span></span><textarea className="field min-h-36 resize-y leading-6" maxLength={2000} value={tweetText} onChange={(event) => setTweetText(event.target.value)} placeholder="What did they say that made you want to respond?" /></label>
            </div>

            <div className="my-6 h-px bg-line" />
            <div className="mb-4 flex items-center justify-between"><div><p className="eyebrow text-electric">Choose your edge</p><p className="mt-1 text-xs text-muted">Your favorite voice is remembered</p></div><span className="font-mono text-[10px] text-muted">02 / 03</span></div>
            <div className="grid grid-cols-2 gap-2">
              {personas.map((item) => <button type="button" key={item.value} onClick={() => choosePersona(item.value)} className={`rounded-xl border p-3 text-left transition ${persona === item.value ? 'border-mint bg-mint/[0.08] shadow-[0_0_0_1px_rgba(115,247,187,.12)]' : 'border-line bg-black/20 hover:border-[#444]'}`}><span className={`mb-4 grid h-7 w-7 place-items-center rounded-lg text-xs font-bold ${persona === item.value ? 'bg-mint text-black' : 'bg-white/[0.08] text-muted'}`}>{item.accent}</span><span className="block text-xs font-semibold text-paper">{item.label}</span><span className="mt-1 block text-[10px] leading-4 text-muted">{item.detail}</span></button>)}
            </div>

            <label className="mt-4 block"><span className="mb-2 flex items-center justify-between text-xs font-semibold text-paper"><span>Model instrument</span><span className="font-normal text-muted">Switch anytime</span></span><select className="field" value={model} onChange={(event) => setModel(event.target.value)}>{OPENROUTER_MODEL_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label} — {option.detail}</option>)}</select></label>

            <div className="my-6 h-px bg-line" />
            <div className="mb-4 flex items-center justify-between"><div><p className="eyebrow text-electric">Draft securely</p><p className="mt-1 text-xs text-muted">History is private to your account</p></div><span className="font-mono text-[10px] text-muted">03 / 03</span></div>
            <div className="rounded-xl border border-mint/20 bg-mint/[0.05] px-4 py-3"><div className="flex gap-3"><LockKeyhole size={16} className="mt-0.5 shrink-0 text-mint" /><div><p className="text-xs font-semibold text-paper">OpenRouter runs on the server.</p><p className="mt-1 text-[11px] leading-5 text-muted">Your generations and favorite voice are saved securely for your account.</p></div></div></div>

            {error && <div className="mt-4 rounded-xl border border-red-400/25 bg-red-400/[0.06] px-4 py-3 text-xs leading-5 text-red-200" role="alert">{error}</div>}
            <button type="submit" disabled={loading} className="primary-button mt-6 w-full"><Sparkles size={16} /> {loading ? 'Finding the signal…' : 'Generate my reply'} <ArrowUpRight size={16} /></button>
          </form>

          <aside className="space-y-5 lg:sticky lg:top-6">
            {loading && <LoadingSpinner />}
            {reply ? <ReplyOutput reply={reply} onReset={reset} /> : <div className="surface rounded-2xl p-5 sm:p-6"><div className="mb-16 flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-mint/10 text-mint"><Sparkles size={17} /></span><span className="eyebrow text-muted">Output / waiting</span></div><h2 className="font-display text-xl font-semibold text-paper">Your reply will land here.</h2><p className="mt-2 text-sm leading-6 text-muted">A good reply doesn&apos;t just react. It adds a reason to keep reading.</p><div className="mt-6 space-y-2 text-xs text-muted"><div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-mint" /> Under 280 characters</div><div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-mint" /> No hashtags, no filler</div><div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-mint" /> Ready to copy or post</div></div></div>}
            <div className="rounded-2xl border border-line bg-white/[0.02] p-4"><div className="flex items-start gap-3"><UserRound size={15} className="mt-0.5 text-muted" /><p className="text-xs leading-5 text-muted">You stay in control. Mask AI drafts the reply; posting is always manual through X.</p></div></div>
          </aside>
        </div>

        <section className="surface mt-5 rounded-2xl p-5 sm:p-6" aria-labelledby="history-heading">
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-electric/10 text-electric"><Clock3 size={17} /></span><div><p className="eyebrow text-electric">Private library</p><h2 id="history-heading" className="mt-1 font-display text-lg font-semibold text-paper">Recent generations</h2></div></div><span className="text-[10px] text-muted">Last 12 drafts</span></div>
          {historyLoading ? <div className="mt-5 flex items-center gap-2 text-xs text-muted"><span className="h-3 w-3 animate-spin rounded-full border border-electric/30 border-t-electric" /> Loading your library…</div> : history.length === 0 ? <p className="mt-5 text-xs leading-5 text-muted">Your best replies will appear here after your first generation.</p> : <div className="mt-5 space-y-2">{history.map((item) => <button type="button" key={item.id} onClick={() => loadHistoryItem(item)} className="group w-full rounded-xl border border-line bg-black/20 p-3 text-left transition hover:border-electric/50"><div className="flex items-center justify-between gap-3"><span className="text-[10px] uppercase tracking-[0.16em] text-mint">{item.persona}</span><span className="text-[10px] text-muted">{timeAgo(item.createdAt)}</span></div><p className="mt-2 line-clamp-2 text-xs leading-5 text-paper">{item.reply}</p><span className="mt-2 inline-flex items-center gap-1 text-[10px] text-muted opacity-0 transition group-hover:opacity-100"><RotateCcw size={11} /> Reuse this draft</span></button>)}</div>}
        </section>
      </div>
    </main>
  );
}

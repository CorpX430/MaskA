'use client';

import { Check, Copy, ExternalLink, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface ReplyOutputProps {
  reply: string;
  onReset: () => void;
}

export default function ReplyOutput({ reply, onReset }: ReplyOutputProps) {
  const [copied, setCopied] = useState(false);
  const copyReply = async () => {
    await navigator.clipboard.writeText(reply);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="surface overflow-hidden rounded-2xl" aria-labelledby="reply-heading">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div><p className="eyebrow">Your reply</p><h2 id="reply-heading" className="mt-1 font-display text-lg font-semibold">Ready for the timeline</h2></div>
        <span className="rounded-full bg-mint/10 px-2.5 py-1 text-[10px] font-semibold text-mint">{reply.length}/280</span>
      </div>
      <div className="p-5">
        <blockquote className="rounded-xl border border-line bg-black/60 p-4 text-[15px] leading-7 text-paper">{reply}</blockquote>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:flex">
          <button onClick={copyReply} className="primary-button !px-4 !py-3 text-xs"><Copy size={15} /> {copied ? 'Copied' : 'Copy reply'}</button>
          <a href={`https://x.com/intent/tweet?text=${encodeURIComponent(reply)}`} target="_blank" rel="noopener noreferrer" className="ghost-button !px-4 !py-3 text-xs"><ExternalLink size={15} /> Open in X</a>
          <button onClick={onReset} className="ghost-button col-span-2 !px-4 !py-3 text-xs sm:ml-auto sm:border-transparent sm:bg-transparent"><RotateCcw size={15} /> Start over</button>
        </div>
        {copied && <p className="mt-3 flex items-center gap-1.5 text-xs text-mint"><Check size={13} /> Reply copied to your clipboard.</p>}
      </div>
    </section>
  );
}

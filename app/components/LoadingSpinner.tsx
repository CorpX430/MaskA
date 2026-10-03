export default function LoadingSpinner() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-electric/20 bg-electric/[0.06] px-4 py-3 text-sm text-[#b9dfff]" role="status" aria-live="polite">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-electric/25 border-t-electric" />
      Masking the signal into a reply…
    </div>
  );
}

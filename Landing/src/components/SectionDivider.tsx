/** Decorative gradient line with a soft center glow, used between major
 * sections instead of a hard border — matches the "premium tech" look
 * without a heavy visual seam. Purely decorative: aria-hidden. */
export default function SectionDivider() {
  return (
    <div className="relative h-px w-full max-w-4xl mx-auto my-2" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-border-soft)] to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-30 blur-[2px]" />
    </div>
  );
}

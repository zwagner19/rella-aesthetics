interface TrustStripProps {
  items: readonly string[];
  ariaLabel: string;
  className?: string;
}

export function TrustStrip({ items, ariaLabel, className = "" }: TrustStripProps) {
  return (
    <section aria-label={ariaLabel} className={`border-y border-white/25 bg-rose ${className}`}>
      <div
        className="mx-auto grid max-w-[1160px] grid-cols-2 gap-px bg-white/25 md:grid-cols-4"
      >
        {items.map((item) => (
          <p
            key={item}
            className="flex min-h-24 items-center justify-center bg-rose px-5 text-center text-xs font-bold uppercase tracking-[0.14em] text-white"
          >
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}

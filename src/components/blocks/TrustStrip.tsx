interface TrustStripProps {
  items: readonly string[];
  ariaLabel: string;
  className?: string;
}

export function TrustStrip({ items, ariaLabel, className = "" }: TrustStripProps) {
  return (
    <section aria-label={ariaLabel} className={`border-y border-rose-light/60 bg-white ${className}`}>
      <div
        className="mx-auto grid max-w-[1200px] grid-cols-2 gap-px bg-rose-light/50 md:grid-cols-4"
      >
        {items.map((item) => (
          <p
            key={item}
            className="flex min-h-24 items-center justify-center bg-white px-5 text-center text-xs font-bold uppercase tracking-[0.12em] text-silver-dark"
          >
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}

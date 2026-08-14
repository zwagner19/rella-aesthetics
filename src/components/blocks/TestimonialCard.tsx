interface TestimonialCardProps {
  quote: string;
  name: string;
  source: string;
  rating?: number;
}

export function TestimonialCard({ quote, name, source, rating = 5 }: TestimonialCardProps) {
  return (
    <div className="border-l-2 border-rose bg-transparent py-2 pl-6 pr-2">
      <div
        className="mb-4 text-sm tracking-[0.2em] text-rose-text"
        aria-label={`${rating} out of 5 stars`}
      >
        {Array.from({ length: rating }, (_, i) => (
          <span key={i}>&#9733;</span>
        ))}
      </div>
      <blockquote className="mb-6 text-base font-light italic leading-relaxed text-ink/75">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <cite className="not-italic">
        <span className="block text-sm font-bold uppercase tracking-[0.1em] text-ink">{name}</span>
        <span className="mt-1 block text-xs font-medium text-ink/70">{source}</span>
      </cite>
    </div>
  );
}

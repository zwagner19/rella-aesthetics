interface TestimonialCardProps {
  quote: string;
  name: string;
  source: string;
  rating?: number;
}

export function TestimonialCard({ quote, name, source, rating = 5 }: TestimonialCardProps) {
  return (
    <div className="bg-white border border-silver-pale rounded-lg p-8">
      <div
        className="mb-3 text-sm tracking-wider text-rose-text"
        aria-label={`${rating} out of 5 stars`}
      >
        {Array.from({ length: rating }, (_, i) => (
          <span key={i}>&#9733;</span>
        ))}
      </div>
      <blockquote className="text-silver-dark font-light italic leading-relaxed mb-6">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <cite className="not-italic">
        <span className="block font-medium text-sm text-ink">{name}</span>
        <span className="text-xs text-silver">{source}</span>
      </cite>
    </div>
  );
}

interface TestimonialCardProps {
  quote: string;
  name: string;
  source: string;
}

export function TestimonialCard({ quote, name, source }: TestimonialCardProps) {
  return (
    <div className="bg-white border border-silver-pale p-8">
      <blockquote className="text-silver leading-relaxed mb-6">&ldquo;{quote}&rdquo;</blockquote>
      <footer>
        <p className="font-medium text-silver-dark">{name}</p>
        <p className="text-sm text-silver">{source}</p>
      </footer>
    </div>
  );
}

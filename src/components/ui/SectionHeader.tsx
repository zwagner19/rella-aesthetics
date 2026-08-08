interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  headingLevel?: 1 | 2;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  headingLevel = 2,
}: SectionHeaderProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <div className="mb-12 max-w-[600px]">
      {eyebrow && (
        <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-silver mb-4">
          {eyebrow}
        </p>
      )}
      <Heading className="font-medium text-2xl md:text-3xl text-silver-dark mb-4">{title}</Heading>
      {description && <p className="text-silver leading-relaxed">{description}</p>}
    </div>
  );
}

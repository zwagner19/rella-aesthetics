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
    <div className="mb-12 max-w-[680px]">
      {eyebrow && (
        <p className="mb-4 text-sm font-medium italic tracking-[0.04em] text-ink/70">
          {eyebrow}
        </p>
      )}
      <Heading className="mb-5 text-3xl font-medium uppercase leading-[1.08] tracking-[0.08em] text-ink md:text-5xl">
        {title}
      </Heading>
      {description && <p className="max-w-[620px] leading-relaxed text-ink/70">{description}</p>}
    </div>
  );
}

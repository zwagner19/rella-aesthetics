interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  headingLevel?: 1 | 2;
  tone?: "default" | "light";
  eyebrowTone?: "default" | "rose" | "light";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  headingLevel = 2,
  tone = "default",
  eyebrowTone = "default",
}: SectionHeaderProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const eyebrowColor =
    eyebrowTone === "light"
      ? "text-ink"
      : eyebrowTone === "rose"
        ? "text-rose-text"
        : "text-ink";
  const titleColor = tone === "light" ? "text-ink" : "text-rose-text";
  const descriptionColor = tone === "light" ? "text-ink" : "text-ink/70";

  return (
    <div className="mb-12 max-w-[680px]">
      {eyebrow && (
        <p className={`mb-4 text-sm font-medium italic tracking-[0.04em] ${eyebrowColor}`}>
          {eyebrow}
        </p>
      )}
      <Heading className={`mb-5 text-3xl font-medium uppercase leading-[1.08] tracking-[0.08em] ${titleColor} md:text-5xl`}>
        {title}
      </Heading>
      {description && <p className={`max-w-[620px] leading-relaxed ${descriptionColor}`}>{description}</p>}
    </div>
  );
}

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
  eyebrowTone = tone === "light" ? "light" : "default",
}: SectionHeaderProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const eyebrowColor =
    eyebrowTone === "light"
      ? "text-white"
      : eyebrowTone === "rose"
        ? "text-rose"
        : "text-ink";
  const titleColor = tone === "light" ? "text-white" : "text-rose";
  const descriptionColor = tone === "light" ? "text-white/90" : "text-ink/70";

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

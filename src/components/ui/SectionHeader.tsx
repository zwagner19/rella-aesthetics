interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** When set, the title uses brand rose instead of ink. */
  titleTone?: "default" | "rose";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  titleTone = "default",
}: SectionHeaderProps) {
  const titleClass =
    titleTone === "rose"
      ? "font-medium text-2xl md:text-3xl text-rose mb-4"
      : "font-medium text-2xl md:text-3xl text-ink mb-4";

  return (
    <div className="mb-12 max-w-[600px]">
      {eyebrow && <p className="text-eyebrow mb-4">{eyebrow}</p>}
      <h2 className={titleClass}>{title}</h2>
      {description && <p className="text-silver leading-relaxed">{description}</p>}
    </div>
  );
}

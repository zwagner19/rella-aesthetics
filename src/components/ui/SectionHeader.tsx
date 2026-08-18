interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-12 max-w-[600px]">
      {eyebrow && <p className="text-eyebrow mb-4">{eyebrow}</p>}
      <h2 className="font-medium text-2xl md:text-3xl text-ink mb-4">{title}</h2>
      {description && <p className="text-silver leading-relaxed">{description}</p>}
    </div>
  );
}

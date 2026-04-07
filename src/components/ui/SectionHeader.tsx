interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-12 max-w-[600px]">
      {eyebrow && (
        <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-silver mb-4">
          {eyebrow}
        </p>
      )}
      <h2 className="font-medium text-2xl md:text-3xl text-silver-dark mb-4">{title}</h2>
      {description && <p className="text-silver leading-relaxed">{description}</p>}
    </div>
  );
}

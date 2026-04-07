import { Button } from "@/components/ui/Button";

interface HeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  secondaryCta?: { text: string; href: string };
  backgroundImage?: string;
}

export function Hero({
  eyebrow,
  title,
  description,
  ctaText,
  ctaHref,
  secondaryCta,
  backgroundImage,
}: HeroProps) {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center py-24 overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12 w-full">
        <div className="relative z-10 max-w-[640px]">
          {eyebrow && (
            <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-silver mb-6">
              {eyebrow}
            </p>
          )}
          <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl tracking-[0.08em] uppercase text-rose-text mb-4 leading-[1.1]">
            {title}
          </h1>
          <p className="text-lg font-light text-silver mb-8 leading-relaxed max-w-[500px]">
            {description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href={ctaHref}>{ctaText}</Button>
            {secondaryCta && (
              <Button href={secondaryCta.href} variant="ghost">
                {secondaryCta.text}
              </Button>
            )}
          </div>
        </div>
      </div>

      {backgroundImage && (
        <div
          className="hidden md:block absolute top-0 right-0 bottom-0 w-1/2 bg-cover bg-center z-0"
          role="img"
          aria-label="Rella Aesthetics med spa"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
    </section>
  );
}

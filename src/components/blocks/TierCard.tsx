import { Button } from "@/components/ui/Button";

interface TierCardProps {
  name: string;
  price: string;
  period: string;
  benefits: string[];
  featured?: boolean;
  ctaHref: string;
  ctaText?: string;
}

export function TierCard({ name, price, period, benefits, featured = false, ctaHref, ctaText = "Get Started" }: TierCardProps) {
  return (
    <div
      className={`relative flex flex-col border bg-white p-8 ${featured ? "pt-12" : ""} ${
        featured ? "border-rose" : "border-silver-pale"
      }`}
    >
      {featured && (
        <span className="absolute left-0 top-0 bg-rose px-4 py-2 text-[0.625rem] font-bold uppercase tracking-[0.15em] text-ink">
          Most Popular
        </span>
      )}
      <h3 className="mb-3 text-xl font-bold uppercase tracking-[0.08em] text-ink">{name}</h3>
      <p className="mb-2">
        <span className="font-bold text-3xl text-ink">{price}</span>
        <span className="font-light text-sm text-ink/60">/{period}</span>
      </p>
      <ul className="my-6 flex-1 space-y-0">
        {benefits.map((benefit, i) => (
          <li
            key={i}
            className="relative border-b border-ink/10 py-3 pl-6 text-sm font-light leading-relaxed text-ink/75"
          >
            <span className="absolute left-0 font-bold text-rose-text">&#10003;</span>
            {benefit}
          </li>
        ))}
      </ul>
      <Button href={ctaHref} variant={featured ? "primary" : "ghost"} className="w-full">
        {ctaText}
      </Button>
    </div>
  );
}

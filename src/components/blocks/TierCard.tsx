import { Button } from "@/components/ui/Button";

interface TierCardProps {
  name: string;
  price: string;
  period: string;
  benefits: string[];
  featured?: boolean;
  ctaHref: string;
}

export function TierCard({ name, price, period, benefits, featured = false, ctaHref }: TierCardProps) {
  return (
    <div
      className={`relative flex flex-col bg-white border rounded-lg p-8 ${
        featured ? "border-rose" : "border-silver-pale"
      }`}
    >
      {featured && (
        <span className="absolute top-0 left-6 bg-rose text-white text-[0.625rem] font-bold tracking-[0.15em] uppercase px-4 py-1 rounded-b">
          Most Popular
        </span>
      )}
      <h3 className="font-medium text-xl text-silver-dark mb-2">{name}</h3>
      <p className="mb-2">
        <span className="font-bold text-3xl text-ink">{price}</span>
        <span className="font-light text-sm text-silver">/{period}</span>
      </p>
      <ul className="my-6 flex-1 space-y-0">
        {benefits.map((benefit, i) => (
          <li
            key={i}
            className="py-2 border-b border-silver-pale text-sm text-silver-dark pl-6 relative"
          >
            <span className="absolute left-0 text-rose font-bold">&#10003;</span>
            {benefit}
          </li>
        ))}
      </ul>
      <Button href={ctaHref} variant={featured ? "primary" : "ghost"} className="w-full">
        Get Started
      </Button>
    </div>
  );
}

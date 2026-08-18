interface LocationCardProps {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  hours: string[];
  href: string;
}

export function LocationCard({
  name,
  address,
  city,
  state,
  zip,
  hours,
  href,
}: LocationCardProps) {
  return (
    <div className="p-8 bg-white border border-silver-pale">
      <h3 className="font-medium text-xl text-ink mb-2">{name}</h3>
      <address className="not-italic text-silver text-sm leading-relaxed mb-4">
        {address}
        <br />
        {city}, {state} {zip}
      </address>
      <ul className="text-sm text-silver space-y-1 mb-6">
        {hours.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      <a
        href={href}
        className="inline-flex min-h-11 items-center font-medium text-[0.8125rem] text-rose-text hover:text-ink transition-colors"
      >
        Location details &rarr;
      </a>
    </div>
  );
}

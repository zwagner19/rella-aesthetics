import { LinkArrow } from "@/components/ui/LinkArrow";

interface LocationCardProps {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  hours: string[];
  href: string;
}

export function LocationCard({ name, address, city, state, zip, hours, href }: LocationCardProps) {
  return (
    <div className="border border-ink/10 border-t-2 border-t-rose bg-white p-8">
      <h3 className="mb-5 text-xl font-bold uppercase tracking-[0.08em] text-ink md:text-2xl">
        {name}
      </h3>
      <address className="mb-6 text-[0.9375rem] font-light not-italic leading-relaxed text-ink/70">
        {address}
        <br />
        {city}, {state} {zip}
        <br />
        <br />
        <strong className="text-xs font-bold uppercase tracking-[0.14em] text-ink/70">Hours</strong>
        <br />
        {hours.map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
      </address>
      <LinkArrow href={href}>{name} details</LinkArrow>
    </div>
  );
}

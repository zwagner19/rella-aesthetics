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
    <div className="p-8 bg-white border border-silver-pale rounded-lg">
      <h3 className="font-medium text-xl text-silver-dark mb-4">{name}</h3>
      <address className="not-italic text-[0.9375rem] text-silver leading-relaxed mb-4">
        {address}
        <br />
        {city}, {state} {zip}
        <br />
        <br />
        <strong className="text-silver-dark">Hours</strong>
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

import { LinkArrow } from "@/components/ui/LinkArrow";

interface LocationCardProps {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  hours: string[];
  href: string;
  googleReviewUrl?: string;
}

export function LocationCard({
  name,
  address,
  city,
  state,
  zip,
  hours,
  href,
  googleReviewUrl,
}: LocationCardProps) {
  return (
    <div className="flex h-full flex-col border border-white/40 bg-white px-6 py-6">
      <h3 className="text-2xl font-medium tracking-[-0.02em] text-ink">{name}</h3>
      <address className="mt-3 mb-5 text-sm font-light not-italic leading-relaxed text-silver">
        {address}
        <br />
        {city}, {state} {zip}
        <br />
        <strong className="mt-3 inline-block text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-silver">
          Hours
        </strong>
        <br />
        {hours.map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
      </address>
      <div className="mt-auto flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <LinkArrow href={href}>{name} details</LinkArrow>
        {googleReviewUrl ? (
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-rose bg-white px-4 py-3 text-center text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-rose focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:w-auto"
          >
            Leave a Google review for Rella {name}
            <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}

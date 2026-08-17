import { LinkArrow } from "@/components/ui/LinkArrow";

interface LocationCardProps {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  hours: string[];
  href: string;
  googleReviewUrl: string;
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
    <div className="border border-ink/10 border-t-2 border-t-rose bg-white p-8">
      <h3 className="mb-5 text-xl font-bold uppercase tracking-[0.08em] text-rose md:text-2xl">
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
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <LinkArrow href={href}>{name} details</LinkArrow>
        <a
          href={googleReviewUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-ink bg-white px-4 py-3 text-center text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-rose focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:w-auto"
        >
          Leave a Google review for Rella {name}
          <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}

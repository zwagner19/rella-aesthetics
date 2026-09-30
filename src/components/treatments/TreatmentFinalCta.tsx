import Image from "next/image";
import Link from "next/link";

interface TreatmentFinalCtaProps {
  id: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  ctaKind: "service-booking" | "phone";
}

export function TreatmentFinalCta({
  id,
  body,
  ctaHref,
  ctaLabel,
  ctaKind,
}: TreatmentFinalCtaProps) {
  return (
    <section
      className="rella-site-reveal relative overflow-hidden bg-charcoal py-32 text-white md:py-40"
      aria-labelledby={id}
    >
      <Image
        src="/images/clinic/napa-reception.webp"
        alt=""
        fill
        className="object-cover object-center opacity-30"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-charcoal/60" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-[720px] px-6 text-center md:px-8">
        <h2
          id={id}
          className="text-[clamp(2rem,4.8vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.025em]"
        >
          Start with a conversation.
        </h2>
        <p className="mx-auto mt-7 max-w-[30rem] text-base font-light leading-relaxed text-white/80 md:text-lg">
          {body}
        </p>
        <Link
          href={ctaHref}
          className="rella-cta-rect rella-cta-rect--filled mt-12"
          data-cta={ctaKind}
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}

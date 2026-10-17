import Image from "next/image";
import Link from "next/link";

interface TreatmentHeroProps {
  eyebrow: string;
  title: string;
  feelLine: string;
  image: string;
  imageAlt: string;
  ctaHref: string;
  ctaLabel: string;
  ctaKind: "service-booking" | "phone";
}

export function TreatmentHero({
  eyebrow,
  title,
  feelLine,
  image,
  imageAlt,
  ctaHref,
  ctaLabel,
  ctaKind,
}: TreatmentHeroProps) {
  return (
    <section className="relative -mt-[72px] flex min-h-[92svh] items-end overflow-hidden bg-charcoal text-white lg:-mt-[84px]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-charcoal/25"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-20 pt-40 md:px-8 md:pb-28 lg:px-12 lg:pb-32">
        <p className="mb-6 text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-rose">
          {eyebrow}
        </p>
        <h1 className="max-w-[14ch] text-[clamp(2.6rem,7vw,5rem)] font-medium leading-[1.02] tracking-[-0.025em] text-white">
          {title}
        </h1>
        <p className="mt-8 max-w-[28rem] text-[1.05rem] font-light leading-[1.55] text-white/88 md:text-xl">
          {feelLine}
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

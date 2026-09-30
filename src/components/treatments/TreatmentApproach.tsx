import Image from "next/image";
import { leadershipMember } from "@/content/team";

interface TreatmentApproachProps {
  id: string;
  headline: string;
  lead: string;
  body: string;
}

export function TreatmentApproach({
  id,
  headline,
  lead,
  body,
}: TreatmentApproachProps) {
  return (
    <section
      className="rella-site-reveal bg-oat/35 py-24 md:py-32"
      aria-labelledby={id}
    >
      <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-6 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-12">
        <div>
          <p className="rella-editorial-eyebrow mb-6">Why at Rella?</p>
          <h2
            id={id}
            className="max-w-[14ch] text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.1] tracking-[-0.025em] text-ink"
          >
            {headline}
          </h2>
          <p className="mt-8 max-w-[34rem] text-[1.15rem] font-medium leading-snug tracking-[-0.015em] text-ink md:text-xl">
            {lead}
          </p>
          <p className="mt-6 max-w-[34rem] text-base font-light leading-relaxed text-silver md:text-lg">
            {body}
          </p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-oat">
          <Image
            src={leadershipMember.image}
            alt={`${leadershipMember.name}, ${leadershipMember.role}`}
            fill
            className="object-cover object-top"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}

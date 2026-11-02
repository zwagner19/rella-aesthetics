import { withWebsiteSeo } from "@/lib/website-seo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  additionalTeamMembers,
  leadershipMember,
  teamLocations,
  teamRoleGroups,
} from "@/content/team";
import { resolveBookingHref } from "@/lib/booking-routes";

const defaultMetadata: Metadata = {
  title: "Meet the Rella Aesthetics Team | Vacaville & Napa",
  description:
    "Meet the Rella Aesthetics leadership and care team serving Vacaville and Napa.",
  alternates: { canonical: "/team" },
  openGraph: {
    title: "Meet the Rella Aesthetics Team",
    description:
      "Meet Rella's founder and owner, medical weight-loss physician, nurses, advanced-practice provider, esthetics, and support team.",
    url: "/team",
    images: [
      {
        url: leadershipMember.image,
        alt: `${leadershipMember.name}, ${leadershipMember.credentials}, founder and owner of Rella Aesthetics`,
      },
    ],
  },
};

type DirectoryMember = {
  readonly name: string;
  readonly image: string;
  readonly role: string;
  readonly bio: readonly string[];
  readonly alsoServes: "napa" | "vacaville" | null;
  readonly primaryLocation: "napa" | "vacaville" | "both";
};

const roster: readonly DirectoryMember[] = [
  ...teamRoleGroups.flatMap(
    (group) => group.members as readonly DirectoryMember[],
  ),
  ...(additionalTeamMembers as readonly DirectoryMember[]),
];

const directoryGridClass =
  "grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-y-10";

function membersNamed(names: readonly string[]) {
  return names.flatMap((name) => {
    const member = roster.find((person) => person.name === name);
    return member ? [member] : [];
  });
}

function locationDirectory(locationId: "napa" | "vacaville") {
  if (locationId === "napa") {
    const featured = [
      "Devyn Pickett",
      "Marisa Avalos",
      "Natalie",
      "Hailey Butler",
      "Ayano",
    ] as const;
    const featuredNames = new Set<string>(featured);
    return [
      ...membersNamed(featured),
      ...roster.filter(
        (member) =>
          member.primaryLocation === "napa" && !featuredNames.has(member.name),
      ),
    ];
  }

  const featured = ["Anna Johnson", "Warda Harchaoui"] as const;
  const featuredNames = new Set<string>(featured);
  return [
    ...membersNamed(featured),
    ...roster.filter(
      (member) =>
        member.primaryLocation === "vacaville" &&
        !featuredNames.has(member.name),
    ),
  ];
}

function locationName(locationId: "napa" | "vacaville") {
  return (
    teamLocations.find((location) => location.id === locationId)?.name ??
    locationId
  );
}

function DirectoryCard({ member }: { member: DirectoryMember }) {
  return (
    <article>
      <div className="relative aspect-[3/4] overflow-hidden bg-rose-blush">
        <Image
          src={member.image}
          alt=""
          fill
          className="object-cover object-top"
          sizes="(min-width: 1024px) 240px, (min-width: 768px) 30vw, 45vw"
        />
      </div>
      <h3 className="mt-3 text-base font-medium leading-snug text-rose-text">
        {member.name}
      </h3>
      <p className="mt-1 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-silver-dark">
        {member.role}
      </p>
      {member.alsoServes ? (
        <p className="mt-2 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-rose-dark">
          Also serves {locationName(member.alsoServes)}
        </p>
      ) : null}
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink/75">
        {member.bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

export default function TeamPage() {
  return (
    <>
      <section className="relative -mt-[72px] flex min-h-[100svh] items-end overflow-hidden bg-charcoal text-white lg:-mt-[84px]">
        <Image
          src="/images/clinic/Warm%20Cozy%20Living%20Room%20Details.png"
          alt="The Napa Transformation House and Rella Vacaville interiors"
          fill
          priority
          unoptimized
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-charcoal/20"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-16 pt-32 md:px-8 md:pb-24 lg:px-12 lg:pb-28">
          <p className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-rose">
            Vacaville + Napa
          </p>
          <h1 className="max-w-[14ch] text-[clamp(2.4rem,6.5vw,4.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-white">
            Meet the people behind Rella
          </h1>
          <p className="mt-6 max-w-[26rem] text-base font-light leading-relaxed text-white/85 md:text-lg">
            Rella brings together medical weight-loss care, nursing, advanced
            practice, esthetics, medical assisting, and patient services for our
            two local communities.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="leadership-heading">
        <div className="mx-auto grid max-w-[1120px] gap-12 px-6 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20 lg:px-12">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden bg-rose-blush lg:mx-0">
            <Image
              src={leadershipMember.image}
              alt={`${leadershipMember.name}, ${leadershipMember.credentials}, founder and owner of Rella Aesthetics`}
              fill
              className="object-cover object-top"
              sizes="(min-width: 1024px) 420px, 90vw"
            />
          </div>

          <div>
            <p className="mb-4 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-ink">
              Leadership
            </p>
            <h2
              id="leadership-heading"
              className="text-3xl font-bold uppercase leading-tight tracking-[0.06em] text-rose-text md:text-5xl"
            >
              {leadershipMember.name}
            </h2>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.12em] text-silver-dark">
              {leadershipMember.credentials} · {leadershipMember.role}
            </p>
            <p className="mt-7 border-l-2 border-rose pl-5 text-lg font-medium text-ink">
              {leadershipMember.focus}
            </p>
            <div className="mt-6 max-w-[620px] space-y-4 leading-relaxed text-ink/70">
              {leadershipMember.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {/*
              Temporarily hidden. Restore this link to /services/weight-loss
              when medical weight loss should be featured on the team page again.
            */}
          </div>
        </div>
      </section>

      <section
        className="border-y border-silver/20 bg-paper py-12 md:py-16"
        aria-label="Rella team by location"
      >
        <div className="mx-auto max-w-[1120px] px-6 md:px-8 lg:px-12">
          <div className="space-y-16">
            {teamLocations.map((location) => {
              const members = locationDirectory(location.id);

              return (
                <section
                  key={location.id}
                  id={`team-location-${location.id}`}
                  aria-labelledby={`team-location-${location.id}-heading`}
                  className="scroll-mt-28"
                >
                  <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                    <h2
                      id={`team-location-${location.id}-heading`}
                      className="text-3xl font-bold uppercase tracking-[0.06em] text-ink md:text-5xl"
                    >
                      {location.name} team
                    </h2>
                    <Link
                      href={location.href}
                      className="w-fit border-b border-ink pb-1 text-xs font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:border-rose"
                    >
                      Explore {location.name} <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                  <ul className={directoryGridClass}>
                    {members.map((member) => (
                      <li key={member.name}>
                        <DirectoryCard member={member} />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="bg-rose-blush py-12 md:py-16"
        aria-labelledby="additional-team-heading"
      >
        <div className="mx-auto max-w-[1120px] px-6 md:px-8 lg:px-12">
          <p className="mb-4 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-ink">
            Rella-wide team
          </p>
          <h2
            id="additional-team-heading"
            className="text-3xl font-bold uppercase tracking-[0.06em] text-ink md:text-4xl"
          >
            Across both locations
          </h2>
          <ul className={`mt-8 ${directoryGridClass}`}>
            {roster
              .filter((member) => member.primaryLocation === "both")
              .map((member) => (
                <li key={member.name}>
                  <DirectoryCard member={member} />
                </li>
              ))}
          </ul>
        </div>
      </section>

      <section
        className="bg-charcoal py-28 text-white md:py-36"
        aria-labelledby="team-close-heading"
      >
        <div className="mx-auto max-w-[720px] px-6 text-center md:px-8">
          <p className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-rose">
            Start with a conversation
          </p>
          <h2
            id="team-close-heading"
            className="text-[clamp(1.95rem,4.5vw,3.35rem)] font-medium leading-[1.12] tracking-[-0.02em]"
          >
            Find the right next step
          </h2>
          <p className="mx-auto mt-5 max-w-[34rem] text-base font-light leading-relaxed text-white/85 md:text-lg">
            Book a consultation or contact Rella with a question about care in
            Vacaville or Napa.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href={resolveBookingHref({})}
              className="rella-cta-rect rella-cta-rect--filled"
            >
              Book a Consultation
            </Link>
            <Link href="/contact" className="rella-cta-rect rella-cta-rect--ghost-light">
              Ask a Question
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return withWebsiteSeo("/team", defaultMetadata);
}

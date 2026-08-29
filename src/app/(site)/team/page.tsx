import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  additionalTeamMembers,
  leadershipMember,
  teamLocations,
  teamRoleGroups,
} from "@/content/team";
import { resolveBookingHref } from "@/lib/booking-routes";

export const metadata: Metadata = {
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

type TeamProfileMember = (typeof teamRoleGroups)[number]["members"][number];
type AdditionalTeamMember = (typeof additionalTeamMembers)[number];
type DirectoryMember = {
  readonly name: string;
  readonly image: string | null;
  readonly role: string;
  readonly bio?: readonly string[];
  readonly alsoServes?: "napa" | "vacaville" | null;
};

function locationName(locationId: "napa" | "vacaville") {
  return (
    teamLocations.find((location) => location.id === locationId)?.name ??
    locationId
  );
}

function TeamProfile({ member }: { member: TeamProfileMember }) {
  if (!member.image) {
    return (
      <article className="border-t border-silver/30 py-8 md:col-span-2 md:grid md:grid-cols-[0.65fr_1.35fr] md:gap-12">
        <div>
          <h4 className="text-2xl font-medium text-rose">{member.name}</h4>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-silver-dark">
            {member.role}
          </p>
        </div>
        <div className="mt-6 space-y-4 text-[0.9375rem] leading-relaxed text-ink/75 md:mt-0">
          {member.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    );
  }

  return (
    <article className="grid gap-6 border-t border-silver/30 pt-6 lg:grid-cols-[minmax(170px,0.85fr)_minmax(0,1.15fr)] lg:gap-8">
      <div className="relative aspect-[4/5] overflow-hidden bg-rose-blush">
        <Image
          src={member.image}
          alt=""
          fill
          className="object-cover object-top"
          sizes="(min-width: 1024px) 480px, (min-width: 768px) 45vw, 100vw"
        />
      </div>
      <div className="pt-0 lg:pt-1">
        <h4 className="text-2xl font-medium text-rose">{member.name}</h4>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-silver-dark">
          {member.role}
        </p>
        {member.alsoServes ? (
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-rose-dark">
            Also serves {locationName(member.alsoServes)}
          </p>
        ) : null}
        <div className="mt-5 space-y-4 text-[0.9375rem] leading-relaxed text-ink/75">
          {member.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

function AdditionalTeamGrid({
  members,
  label,
}: {
  members: readonly AdditionalTeamMember[];
  label: string;
}) {
  if (members.length === 0) return null;

  return (
    <section
      className="mt-16 border-t border-silver/25 pt-10"
      aria-label={label}
    >
      <h3 className="mb-7 text-sm font-bold uppercase tracking-[0.16em] text-silver-dark">
        {label}
      </h3>
      <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <li key={member.name}>
            <div className="relative aspect-[4/5] overflow-hidden bg-rose-blush">
              <Image
                src={member.image}
                alt=""
                fill
                className="object-cover object-top"
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, calc(100vw - 3rem)"
              />
            </div>
            <p className="border-t border-silver/35 pb-2 pt-5 text-lg font-medium text-rose">
              {member.name}
            </p>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-silver-dark">
              {member.role}
            </p>
            {member.alsoServes ? (
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-rose-dark">
                Also serves {locationName(member.alsoServes)}
              </p>
            ) : null}
            <div className="mt-4 space-y-4 text-[0.9375rem] leading-relaxed text-ink/75">
              {member.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NapaRoleSection({
  label,
  names,
  members,
}: {
  label: string;
  names: readonly string[];
  members: readonly DirectoryMember[];
}) {
  const selected = names
    .map((name) => members.find((member) => member.name === name))
    .filter((member): member is DirectoryMember => Boolean(member));

  if (selected.length === 0) return null;

  return (
    <section className="mb-16" aria-label={`Napa ${label}`}>
      <h3 className="mb-7 text-sm font-bold uppercase tracking-[0.16em] text-silver-dark">
        {label}
      </h3>
      <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
        {selected.map((member) => (
          <article
            key={member.name}
            className={
              member.image
                ? "grid gap-6 border-t border-silver/30 pt-6 lg:grid-cols-[minmax(170px,0.85fr)_minmax(0,1.15fr)] lg:gap-8"
                : "border-t border-silver/30 pt-6"
            }
          >
            {member.image ? (
              <div className="relative aspect-[4/5] overflow-hidden bg-rose-blush">
                <Image
                  src={member.image}
                  alt=""
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 1024px) 480px, (min-width: 768px) 45vw, 100vw"
                />
              </div>
            ) : null}
            <div className="pt-0 lg:pt-1">
              <h4 className="text-2xl font-medium text-rose">{member.name}</h4>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-silver-dark">
                {member.role}
              </p>
              {member.alsoServes ? (
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-rose-dark">
                  Also serves {locationName(member.alsoServes)}
                </p>
              ) : null}
              {member.bio ? (
                <div className="mt-5 space-y-4 text-[0.9375rem] leading-relaxed text-ink/75">
                  {member.bio.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function TeamPage() {
  return (
    <>
      <section className="border-b border-silver/25 bg-rose">
        <div className="mx-auto max-w-[1050px] px-6 py-20 md:px-8 md:py-28 lg:px-12">
          <p className="mb-5 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-white">
            Vacaville + Napa
          </p>
          <h1 className="max-w-[850px] text-4xl font-bold uppercase leading-[1.04] tracking-[0.06em] text-white md:text-6xl">
            Meet the people behind Rella.
          </h1>
          <p className="mt-7 max-w-[720px] text-lg font-light leading-relaxed text-white md:text-xl">
            Rella brings together medical weight-loss care, nursing, advanced
            practice, esthetics, medical assisting, and patient services for our
            two local communities.
          </p>
        </div>
      </section>

      <section
        className="bg-white py-10 md:py-14"
        aria-label="Rella Aesthetics team photo"
      >
        <div className="mx-auto max-w-[1120px] px-6 md:px-8 lg:px-12">
          <Image
            src="/images/clinic/rella-team-storefront.webp"
            alt="Rella Aesthetics team outside the Napa clinic"
            width={1600}
            height={900}
            className="h-auto w-full"
            sizes="(min-width: 1120px) 1024px, calc(100vw - 3rem)"
          />
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="leadership-heading">
        <div className="mx-auto grid max-w-[1120px] gap-12 px-6 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20 lg:px-12">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden bg-rose-blush lg:mx-0">
            <Image
              src={leadershipMember.image}
              alt={`${leadershipMember.name}, ${leadershipMember.credentials}, founder and owner of Rella Aesthetics`}
              fill
              priority
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
              className="text-3xl font-bold uppercase leading-tight tracking-[0.06em] text-rose md:text-5xl"
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
            <Link
              href="/services/weight-loss"
              className="mt-7 inline-flex border-b border-ink pb-1 text-xs font-bold uppercase tracking-[0.14em] text-ink"
            >
              Explore Medical Weight Loss <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section
        className="border-y border-silver/20 bg-paper py-20 md:py-28"
        aria-label="Rella team by location"
      >
        <div className="mx-auto max-w-[1120px] px-6 md:px-8 lg:px-12">
          <div className="space-y-28">
            {teamLocations.map((location) => {
              const directoryMembers: readonly DirectoryMember[] = [
                ...(teamRoleGroups.flatMap(
                  (group) =>
                    group.members as unknown as readonly DirectoryMember[],
                ) as DirectoryMember[]),
                ...(additionalTeamMembers as unknown as readonly DirectoryMember[]),
              ];
              const napaCustomNames = new Set([
                "Devyn Pickett",
                "Marisa Avalos",
                "Natalie",
                "Hailey Butler",
                "Ayano",
              ]);
              const roleGroups = teamRoleGroups
                .map((group) => ({
                  ...group,
                  members: group.members.filter(
                    (member) =>
                      member.primaryLocation === location.id &&
                      !(
                        location.id === "napa" &&
                        napaCustomNames.has(member.name)
                      ),
                  ),
                }))
                .filter((group) => group.members.length > 0);
              const additionalMembers = additionalTeamMembers.filter(
                (member) =>
                  member.primaryLocation === location.id &&
                  !(location.id === "napa" && napaCustomNames.has(member.name)),
              );
              const featuredMembers: TeamProfileMember[] =
                location.id === "vacaville"
                  ? teamRoleGroups
                      .reduce<TeamProfileMember[]>(
                        (all, group) =>
                          all.concat(
                            group.members as unknown as TeamProfileMember[],
                          ),
                        [],
                      )
                      .filter(
                        (member) =>
                          member.name === "Anna Johnson" ||
                          member.name === "Warda Harchaoui",
                      )
                  : [];

              return (
                <section
                  key={location.id}
                  id={`team-location-${location.id}`}
                  aria-labelledby={`team-location-${location.id}-heading`}
                  className="scroll-mt-28 border-t border-silver/30 pt-12 first:border-t-0 first:pt-0"
                >
                  <div className="mb-14 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                      <h2
                        id={`team-location-${location.id}-heading`}
                        className="text-3xl font-bold uppercase tracking-[0.06em] text-ink md:text-5xl"
                      >
                        {location.name} team
                      </h2>
                    </div>
                    <Link
                      href={location.href}
                      className="w-fit border-b border-ink pb-1 text-xs font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:border-rose"
                    >
                      Explore {location.name} <span aria-hidden="true">→</span>
                    </Link>
                  </div>

                  {location.id === "napa" ? (
                    <>
                      <NapaRoleSection
                        label="Aesthetic Injectors"
                        names={["Devyn Pickett", "Marisa Avalos"]}
                        members={directoryMembers}
                      />
                      <NapaRoleSection
                        label="Esthetician"
                        names={["Natalie"]}
                        members={directoryMembers}
                      />
                      <NapaRoleSection
                        label="Medical Assistant"
                        names={["Hailey Butler"]}
                        members={directoryMembers}
                      />
                      <NapaRoleSection
                        label="Front Desk / Patient Services"
                        names={["Ayano"]}
                        members={directoryMembers}
                      />
                    </>
                  ) : null}

                  {location.id === "napa" && additionalMembers.length > 0 ? (
                    <AdditionalTeamGrid
                      members={additionalMembers}
                      label="Additional Napa team"
                    />
                  ) : null}

                  {featuredMembers.length > 0 ? (
                    <section
                      className="mb-16"
                      aria-label="Vacaville clinical team"
                    >
                      <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
                        {featuredMembers.map((member) => (
                          <TeamProfile key={member.name} member={member} />
                        ))}
                      </div>
                    </section>
                  ) : null}

                  <div className="space-y-16">
                    {roleGroups.map((group) => {
                      const displayedMembers = group.members.filter(
                        (member) =>
                          !featuredMembers.some(
                            (featured) => featured.name === member.name,
                          ),
                      );
                      if (displayedMembers.length === 0) return null;
                      const groupId = `team-${location.id}-${group.title
                        .toLowerCase()
                        .replaceAll(" ", "-")
                        .replaceAll("&", "and")}`;

                      return (
                        <section key={group.title} aria-labelledby={groupId}>
                          <h3
                            id={groupId}
                            className="mb-7 text-sm font-bold uppercase tracking-[0.16em] text-silver-dark"
                          >
                            {group.title}
                          </h3>
                          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
                            {displayedMembers.map((member) => (
                              <TeamProfile key={member.name} member={member} />
                            ))}
                          </div>
                        </section>
                      );
                    })}
                  </div>

                  {location.id !== "napa" ? (
                    <AdditionalTeamGrid
                      members={additionalMembers}
                      label={`More of the ${location.name} team`}
                    />
                  ) : null}
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="bg-rose-blush py-20 md:py-24"
        aria-labelledby="additional-team-heading"
      >
        <div className="mx-auto max-w-[1120px] px-6 md:px-8 lg:px-12">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
            <div>
              <p className="mb-4 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-ink">
                Rella-wide team
              </p>
              <h2
                id="additional-team-heading"
                className="text-3xl font-bold uppercase tracking-[0.06em] text-ink md:text-4xl"
              >
                Across both locations.
              </h2>
            </div>
            <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {additionalTeamMembers
                .filter((member) => member.primaryLocation === "both")
                .map((member) => (
                  <li key={member.name}>
                    <div className="relative aspect-[4/5] overflow-hidden bg-paper">
                      <Image
                        src={member.image}
                        alt=""
                        fill
                        className="object-cover object-top"
                        sizes="(min-width: 1024px) 180px, (min-width: 768px) 28vw, (min-width: 640px) 45vw, calc(100vw - 3rem)"
                      />
                    </div>
                    <p className="border-t border-silver/35 pb-2 pt-5 text-lg font-medium text-rose">
                      {member.name}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-silver-dark">
                      {member.role}
                    </p>
                    <div className="mt-4 space-y-4 text-[0.9375rem] leading-relaxed text-ink/75">
                      {member.bio.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-rose py-16 text-white md:py-20">
        <div className="mx-auto flex max-w-[900px] flex-col items-center px-6 text-center">
          <p className="mb-4 text-[0.75rem] font-medium capitalize italic tracking-[0.08em] text-white">
            Start with a conversation
          </p>
          <h2 className="text-3xl font-bold uppercase tracking-[0.06em] md:text-5xl">
            Find the right next step.
          </h2>
          <p className="mb-8 mt-5 max-w-[650px] font-light leading-relaxed text-white/70 md:text-lg">
            Book a consultation or contact Rella with a question about care in
            Vacaville or Napa.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              href={resolveBookingHref({})}
              variant="light"
              disableHover
              className="!border-white !bg-white !text-rose"
            >
              Book a Consultation
            </Button>
            <Button
              href="/contact"
              disableHover
              className="!border-white !bg-transparent !text-white"
            >
              Ask a Question
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

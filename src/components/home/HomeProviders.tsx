import Image from "next/image";
import Link from "next/link";
import {
  additionalTeamMembers,
  leadershipMember,
  teamRoleGroups,
} from "@/content/team";

type ProviderRailItem = {
  name: string;
  role: string;
  image: string;
};

function buildProviderRail(): readonly ProviderRailItem[] {
  const fromGroups = teamRoleGroups.flatMap((group) =>
    group.members.map((member) => ({
      name: member.name,
      role: member.role,
      image: member.image,
    })),
  );
  const additional = additionalTeamMembers.map((member) => ({
    name: member.name,
    role: member.role,
    image: member.image,
  }));

  return [
    {
      name: leadershipMember.name,
      role: leadershipMember.role,
      image: leadershipMember.image,
    },
    ...fromGroups,
    ...additional,
  ];
}

export function HomeProviders() {
  const providers = buildProviderRail();

  return (
    <section
      className="rella-site-reveal bg-ivory py-20 md:py-28"
      aria-labelledby="providers-heading"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12">
        <div className="mb-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
          <div>
            <p className="rella-editorial-eyebrow mb-4">The people behind Rella</p>
            <h2
              id="providers-heading"
              className="max-w-[16ch] text-[clamp(1.85rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
            >
              A familiar face makes a difference.
            </h2>
          </div>
          <p className="max-w-[32rem] text-base font-light leading-relaxed text-silver md:text-lg">
            You&apos;ll see the same thoughtful team from consultation through follow-up — people
            who learn your face and your preferences over time.
          </p>
        </div>

        <div className="relative mb-12 aspect-[16/9] overflow-hidden bg-oat md:mb-14">
          <Image
            src="/images/clinic/rella-team-storefront.webp"
            alt="Rella Aesthetics team gathered outside the clinic"
            fill
            className="object-cover object-center"
            sizes="(min-width: 1440px) 1440px, 100vw"
          />
        </div>

        <div className="rella-provider-rail" role="list" aria-label="Rella team members">
          {providers.map((provider) => (
            <div key={`${provider.name}-${provider.role}`} className="w-[148px] sm:w-[168px]" role="listitem">
              <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-oat">
                <Image
                  src={provider.image}
                  alt=""
                  fill
                  className="object-cover object-top"
                  sizes="168px"
                />
              </div>
              <p className="text-sm font-medium text-ink">{provider.name}</p>
              <p className="mt-1 text-xs font-light uppercase tracking-[0.12em] text-silver">
                {provider.role}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/team"
            className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink underline-offset-4 hover:text-rose hover:underline"
          >
            Meet the team
          </Link>
        </div>
      </div>
    </section>
  );
}

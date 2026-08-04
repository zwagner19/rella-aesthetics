import { Button } from "@/components/ui/Button";

export function MembershipBanner() {
  return (
    <section className="bg-rose-blush py-12">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-silver mb-2">
              2026 Tox Membership
            </p>
            <h2 className="font-medium text-2xl md:text-3xl text-silver-dark mb-2">
              $30/month. Clear member rates.
            </h2>
            <p className="text-silver max-w-lg">
              With a one-year commitment, members pay $13/unit for Botox and $4.40/unit for Dysport. Review complete terms before enrolling.
            </p>
          </div>
          <Button href="/membership" className="shrink-0">
            See Membership Details
          </Button>
        </div>
      </div>
    </section>
  );
}

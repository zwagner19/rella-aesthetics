import { Button } from "@/components/ui/Button";

export function MembershipBanner() {
  return (
    <section className="bg-rose-blush py-12">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-silver mb-2">
              VIP Membership
            </p>
            <h2 className="font-medium text-2xl md:text-3xl text-silver-dark mb-2">
              Elevated Care, Every Month
            </h2>
            <p className="text-silver max-w-lg">
              Become a Rella VIP member and access preferred pricing, complimentary treatments, and
              exclusive wellness benefits tailored to your aesthetic goals.
            </p>
          </div>
          <Button href="/membership" className="shrink-0">
            Explore Membership
          </Button>
        </div>
      </div>
    </section>
  );
}

import { Button } from "@/components/ui/Button";

export function MembershipBanner() {
  return (
    <section className="border-y border-ink/10 bg-rose py-16">
      <div className="mx-auto max-w-[1160px] px-6 md:px-8 lg:px-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="mb-3 text-sm font-normal italic text-white">
              2026 Injectable Memberships
            </p>
            <h2 className="mb-3 text-2xl font-bold uppercase leading-tight tracking-[0.08em] text-white md:text-3xl">
              Tox plans from $30/month.
            </h2>
            <p className="max-w-lg font-light leading-relaxed text-white">
              Compare Tox, Filler, and Tox + Filler plans with current member
              rates, included benefits, and one-year terms.
            </p>
          </div>
          <Button
            href="/membership"
            variant="ghost"
            disableHover
            className="shrink-0 border-white bg-white text-rose"
          >
            Compare Memberships
          </Button>
        </div>
      </div>
    </section>
  );
}

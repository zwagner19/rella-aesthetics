import type { Metadata } from "next";

import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Private Parties",
  description:
    "Ask Rella Aesthetics about planning an at-home private event for a group of six or more.",
  alternates: { canonical: "/private-parties" },
};

export default function PrivatePartiesPage() {
  return (
    <>
      <section className="bg-rose/25 py-24 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">
          <p className="mb-4 text-sm font-medium italic tracking-[0.04em] text-ink">
            Private Events
          </p>
          <h1 className="max-w-[760px] text-4xl font-bold uppercase leading-[1.08] tracking-[0.08em] text-ink md:text-6xl">
            Private Parties
          </h1>
          <p className="mt-6 max-w-[620px] text-lg font-light leading-relaxed text-ink/70">
            Experience Rella in the comfort of your home. Private-event planning starts with a
            direct conversation with the Rella team.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:px-12">
          <div>
            <p className="mb-4 text-sm font-medium italic tracking-[0.04em] text-ink">
              Get in Touch
            </p>
            <h2 className="text-3xl font-bold uppercase leading-[1.12] tracking-[0.07em] text-ink md:text-5xl">
              Start planning your event
            </h2>
            <p className="mt-6 max-w-[620px] leading-8 text-ink/70">
              A minimum of six people is required to host a private event. Tell us about your
              event and city, and a member of the Rella team will follow up to discuss planning
              details.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Button href="/contact?intent=private-parties">Plan a Private Event</Button>
              <Button href="tel:+17073582928" variant="ghost">Call 707.358.2928</Button>
            </div>
          </div>

          <aside className="border-y border-ink/15 bg-paper py-8 lg:px-8" aria-label="Private event booking note">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink">Private inquiry</p>
            <p className="mt-5 leading-8 text-ink/70">
              Private events are planned directly with Rella. They are not ordinary appointment
              bookings and do not appear in the public treatment catalog.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}

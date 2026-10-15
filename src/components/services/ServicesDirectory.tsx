"use client";

import { useState } from "react";
import { BookTrigger } from "@/components/guided-booking/BookTrigger";
import type { BookingIntent } from "@/lib/booking-routes";

const PHONE_HREF = "tel:+17073582928";

type Treatment = {
  name: string;
  summary: string;
};

type ConsultAction = {
  label: string;
  intent: BookingIntent;
};

type Category = {
  id: string;
  label: string;
  description: string;
  cta: string;
  treatments: readonly Treatment[];
  consult?: readonly ConsultAction[];
  phone?: { label: string; href: string };
};

const primaryCategories: readonly Category[] = [
  {
    id: "injectables",
    label: "Injectables",
    description: "Botox, Dysport, and dermal fillers for lines, volume, and facial balance.",
    cta: "Explore Injectables",
    treatments: [
      {
        name: "Botox & Dysport",
        summary:
          "Botox and Dysport temporarily soften lines that appear with expression, such as forehead lines, frown lines, and crow's feet. Product and placement are chosen after facial movement and goals are reviewed.",
      },
      {
        name: "Dermal fillers",
        summary:
          "Injectable gels that may add volume or support contour in the cheeks, lips, and facial folds when appropriate. Amount and product are planned individually.",
      },
    ],
    consult: [{ label: "Book a Consultation", intent: { category: "injectables" } }],
  },
  {
    id: "skin",
    label: "Skin",
    description:
      "Facials, HydraFacial, chemical peels, and microneedling for texture, clarity, and maintenance.",
    cta: "Explore Skin",
    treatments: [
      {
        name: "Facials",
        summary:
          "Assessment-led care for congestion, dullness, sensitivity, and routine maintenance, shaped around your skin that day.",
      },
      {
        name: "HydraFacial",
        summary:
          "A multi-step cleanse, extract, and hydrate visit. Signature, Deluxe, or Platinum is chosen after a skin review.",
      },
      {
        name: "Chemical peels",
        summary:
          "Controlled exfoliation for tone, texture, and dullness when the formulation and recovery fit. Offered in Vacaville.",
      },
      {
        name: "Microneedling",
        summary:
          "Controlled microchannels for texture and the appearance of acne scars, with candidacy and recovery planned first. Offered in Vacaville.",
      },
    ],
    consult: [{ label: "Book a Consultation", intent: {} }],
  },
  {
    id: "lasers",
    label: "Lasers",
    description: "IPL, laser hair removal, and resurfacing, selected after your skin is assessed.",
    cta: "Explore Lasers",
    treatments: [
      {
        name: "IPL",
        summary:
          "Light-based care for pigmentation, sun damage, and redness when appropriate for your skin.",
      },
      {
        name: "Laser hair removal",
        summary: "Hair reduction planned by treatment area.",
      },
      {
        name: "Spider-vein treatment",
        summary:
          "Laser or IPL therapy for spider veins and broken capillaries after the area is reviewed.",
      },
      {
        name: "Erbium resurfacing",
        summary:
          "Resurfacing considered for texture, tone, fine lines, sun damage, and acne scars after assessment.",
      },
      {
        name: "CO2 CoolPeel",
        summary:
          "Resurfacing for texture and fine lines, planned around recovery and sun exposure.",
      },
    ],
    consult: [{ label: "Book a Consultation", intent: { category: "laser" } }],
  },
];

const secondaryCategories: readonly Category[] = [
  {
    id: "wellness",
    label: "Wellness",
    description: "IV hydration, with screening before treatment.",
    cta: "Explore Wellness",
    treatments: [
      {
        name: "IV Hydration",
        summary:
          "Clinician-guided fluids and ingredients, chosen after screening. The infusion is monitored, and the formula depends on your history, goals, and symptoms.",
      },
    ],
    phone: { label: "Call to book", href: PHONE_HREF },
  },
  {
    id: "weight-loss",
    label: "Medical Weight Loss",
    description: "A physician-led program that starts with a qualification visit.",
    cta: "Explore Medical Weight Loss",
    treatments: [
      {
        name: "Medical Weight Loss",
        summary:
          "The program begins with a qualification visit with Zachary Wagner, DO. Medication, including GLP-1 options, is discussed only when clinically appropriate and is not guaranteed.",
      },
    ],
    consult: [
      {
        label: "Book Vacaville",
        intent: { location: "vacaville", service: "weight-loss" },
      },
      {
        label: "Book Napa",
        intent: { location: "napa", service: "weight-loss" },
      },
    ],
  },
];

function ServiceCard({
  category,
  open,
  onToggle,
  heading,
  spanClass,
}: {
  category: Category;
  open: boolean;
  onToggle: (id: string) => void;
  heading: "h2" | "h3";
  spanClass: string;
}) {
  const Title = heading;
  const TreatmentTitle = heading === "h2" ? "h3" : "h4";
  const panelId = `${category.id}-treatments`;

  return (
    <article
      className={`flex min-w-0 flex-col border px-7 py-8 transition-colors duration-300 ease-out motion-reduce:transition-none md:px-8 ${
        open
          ? `${spanClass} rella-rose-expanded border-[#222222]/15`
          : "h-full border-ink/10 bg-oat text-ink"
      } ${heading === "h2" ? "md:py-10" : "py-7"}`}
    >
      <Title
        className={
          heading === "h2"
            ? "text-[1.75rem] font-medium leading-none tracking-[-0.03em] md:text-[2rem]"
            : "text-xl font-medium tracking-[-0.025em] md:text-2xl"
        }
      >
        {category.label}
      </Title>
      <p
        className={`font-light leading-relaxed ${
          heading === "h2"
            ? "mt-5 text-base"
            : "mt-3 text-sm md:text-base"
        } ${open ? "text-[#ffffff]" : heading === "h2" ? "text-ink/75" : "text-ink/70"}`}
      >
        {category.description}
      </p>
      <div className={heading === "h2" ? "mt-auto pt-8" : "mt-6"}>
        <button
          type="button"
          className={`rella-cta-rect w-fit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
            open ? "rella-cta-rect--ghost-light" : "rella-cta-rect--ghost"
          }`}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => onToggle(category.id)}
        >
          {open ? "Close" : category.cta}
        </button>
      </div>

      <div
        id={panelId}
        role="region"
        aria-label={`${category.label} treatments`}
        aria-hidden={open ? undefined : true}
        inert={open ? undefined : true}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <ul className="mt-8 grid gap-6 border-t border-[#222222]/20 pt-8 md:grid-cols-2 md:gap-x-12 md:gap-y-8">
            {category.treatments.map((treatment) => (
              <li key={treatment.name} className="min-w-0">
                <TreatmentTitle className="text-lg font-medium tracking-[-0.02em] text-[#ffffff]">
                  {treatment.name}
                </TreatmentTitle>
                <p className="mt-2 text-base font-light leading-relaxed text-[#ffffff]">
                  {treatment.summary}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            {category.consult?.map((action) => (
              <BookTrigger
                key={action.label}
                intent={action.intent}
                className="rella-cta-rect rella-cta-rect--ghost-light w-fit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {action.label}
              </BookTrigger>
            ))}
            {category.phone ? (
              <a
                href={category.phone.href}
                className="rella-cta-rect rella-cta-rect--ghost-light w-fit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {category.phone.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ServicesDirectory() {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <>
      <div className="mt-12 grid items-start gap-5 md:mt-16 md:grid-cols-3 md:gap-6">
        {primaryCategories.map((category) => (
          <ServiceCard
            key={category.id}
            category={category}
            open={openId === category.id}
            onToggle={toggle}
            heading="h2"
            spanClass="md:col-span-3"
          />
        ))}
      </div>

      <section className="mt-14 md:mt-20" aria-labelledby="additional-services-heading">
        <h2
          id="additional-services-heading"
          className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-silver"
        >
          Also available
        </h2>
        <div className="mt-5 grid items-start gap-5 sm:grid-cols-2 md:gap-6">
          {secondaryCategories.map((category) => (
            <ServiceCard
              key={category.id}
              category={category}
              open={openId === category.id}
              onToggle={toggle}
              heading="h3"
              spanClass="sm:col-span-2"
            />
          ))}
        </div>
      </section>
    </>
  );
}
